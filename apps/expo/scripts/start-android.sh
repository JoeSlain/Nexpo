#!/usr/bin/env bash
set -e

# Start Android emulator if no device is connected, then run the app.
# Requires ANDROID_HOME (e.g. $HOME/Library/Android/sdk on Mac).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Resolve Android SDK tools
ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
EMULATOR="${ANDROID_HOME}/emulator/emulator"
ADB="${ANDROID_HOME}/platform-tools/adb"

run_app() {
  cd "$APP_DIR" && NODE_ENV=development node scripts/load-env.js expo run:android
}

if [[ ! -x "$ADB" ]]; then
  echo "Android SDK not found. Set ANDROID_HOME (e.g. export ANDROID_HOME=\$HOME/Library/Android/sdk)."
  exit 1
fi

# Check if a device or emulator is already connected
if "$ADB" devices -l 2>/dev/null | grep -q 'device$\|device '; then
  echo "Android device/emulator already connected. Running app..."
  run_app
  exit 0
fi

# No device: try to start an AVD
if [[ ! -x "$EMULATOR" ]]; then
  echo "Emulator not found at $EMULATOR. Start an AVD from Android Studio (Device Manager) and run again."
  exit 1
fi

AVD="$("$EMULATOR" -list-avds 2>/dev/null | head -1)"
if [[ -z "$AVD" ]]; then
  echo "No AVD found. Create one in Android Studio: More Actions → Virtual Device Manager."
  exit 1
fi

echo "Starting emulator: $AVD"
"$EMULATOR" -avd "$AVD" -no-snapshot-load &

# Wait for emulator to boot (boot_completed = 1)
echo "Waiting for emulator to boot..."
"$ADB" wait-for-device
SECONDS=0
while [[ "$("$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]]; do
  if (( SECONDS >= 120 )); then
    echo "Emulator failed to boot within 120s."
    exit 1
  fi
  sleep 2
done
echo "Emulator ready."

# Bring emulator window to front on macOS
if [[ "$(uname)" == "Darwin" ]]; then
  osascript -e 'tell application "Emulator" to activate' 2>/dev/null ||
    osascript -e 'tell application "System Events" to set frontmost of (first process whose name contains "qemu") to true' 2>/dev/null ||
    true
fi

run_app
