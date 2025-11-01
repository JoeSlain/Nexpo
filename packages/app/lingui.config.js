import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "cs", "fr"],
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: ["<rootDir>"],
    },
  ],
});

