import { defineConfig } from "@lingui/cli";

export default defineConfig({
	sourceLocale: "en",
	locales: ["en", "cs", "fr"],
	catalogs: [
		{
			path: "<rootDir>/packages/app/locales/{locale}/messages",
			include: ["packages/app"],
		},
	],
});
