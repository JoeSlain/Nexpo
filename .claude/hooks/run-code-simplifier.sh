#!/usr/bin/env bash
set -euo pipefail

payload_file="$(mktemp)"
cat >"${payload_file}" || true

cleanup() {
  rm -f "${payload_file}"
}
trap cleanup EXIT

# Claude hooks expect stdin to be preserved for downstream processing.
forward_payload() {
  cat "${payload_file}"
}

# Prevent recursive hook execution when the simplifier itself edits files.
if [[ "${CODE_SIMPLIFIER_RUNNING:-}" == "1" ]]; then
  forward_payload
  exit 0
fi

file_path="$(
  node -e '
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        const filePath = parsed?.tool_input?.file_path;
        process.stdout.write(typeof filePath === "string" ? filePath : "");
      } catch {
        process.stdout.write("");
      }
    });
  ' <"${payload_file}"
)"

if [[ -z "${file_path}" ]]; then
  forward_payload
  exit 0
fi

read -r -d '' simplifier_prompt <<'EOF' || true
Simplify and refine the code that was just modified while preserving exact behavior.
Focus only on the most recently touched code.
Follow CLAUDE.md standards.
EOF

prompt="${simplifier_prompt}"$'\n\n'"Prioritize this file: ${file_path}"

CODE_SIMPLIFIER_RUNNING=1 claude \
  -p \
  --agent code-simplifier \
  --permission-mode bypassPermissions \
  "${prompt}" \
  >/dev/null 2>&1 || true

forward_payload
