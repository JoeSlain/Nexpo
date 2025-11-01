import { setupI18n } from "@lingui/core";
import { I18nProvider, type TransRenderProps } from "@lingui/react";
import * as Localization from "expo-localization";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Text } from "react-native";

export type LocaleInfo = {
	languageTag: string;
	languageCode: string | null;
	regionCode: string | null;
	currencyCode: string | null;
	currencySymbol: string | null;
	decimalSeparator: string | null;
	digitGroupingSeparator: string | null;
	textDirection: "ltr" | "rtl" | null;
	measurementSystem: "metric" | "us" | "uk" | null;
	temperatureUnit: "celsius" | "fahrenheit" | null;
};

type LocaleContextType = {
	locale: LocaleInfo;
	setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType>({
	locale: {
		languageTag: "en",
		languageCode: "en",
		regionCode: null,
		currencyCode: null,
		currencySymbol: null,
		decimalSeparator: ".",
		digitGroupingSeparator: ",",
		textDirection: "ltr",
		measurementSystem: "metric",
		temperatureUnit: "celsius",
	},
	setLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

// Helper function to get initial locale from device
function getInitialLocale(): LocaleInfo {
	const localizationLocale = Localization.getLocales()[0];

	const localeInfo: LocaleInfo = {
		languageTag: localizationLocale.languageTag,
		languageCode: localizationLocale.languageCode || null,
		regionCode: localizationLocale.regionCode || null,
		currencyCode: localizationLocale.currencyCode || null,
		currencySymbol: localizationLocale.currencySymbol || null,
		decimalSeparator: localizationLocale.decimalSeparator || null,
		digitGroupingSeparator: localizationLocale.digitGroupingSeparator || null,
		textDirection: localizationLocale.textDirection || "ltr",
		measurementSystem: localizationLocale.measurementSystem || "metric",
		temperatureUnit: localizationLocale.temperatureUnit || "celsius",
	};

	return localeInfo;
}

// Helper function to get supported Lingui locale
function getLinguiLocale(languageCode: string | null): string {
	const supportedLocales = ["en", "cs", "fr"];
	if (!languageCode) return "en";

	// Use the language code part for Lingui (e.g., 'en' from 'en-US')
	return supportedLocales.includes(languageCode) ? languageCode : "en";
}

// Default component for Trans macro (Text component for React Native)
const DefaultComponent = (props: TransRenderProps) => {
	return <Text>{props.children}</Text>;
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [locale, setLocaleState] = useState<LocaleInfo>(getInitialLocale);

	// Dynamically import messages based on locale
	const linguiLocale = getLinguiLocale(locale.languageCode);

	// Initialize i18n instance with messages
	const linguiInstance = useMemo(() => {
		// Dynamically import messages - After running `lingui compile`,
		// messages will be available in the compiled message files
		let messages = {};

		try {
			if (linguiLocale === "cs") {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				messages = require("../../locales/cs/messages").messages || {};
			} else if (linguiLocale === "fr") {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				messages = require("../../locales/fr/messages").messages || {};
			} else {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				messages = require("../../locales/en/messages").messages || {};
			}
		} catch {
			// Messages not compiled yet, use empty object
			console.warn(
				`Messages for locale "${linguiLocale}" not found. Run 'yarn lingui:compile' to compile messages.`,
			);
		}

		const instance = setupI18n({
			locale: linguiLocale,
			messages: { [linguiLocale]: messages },
		});

		return instance;
	}, [linguiLocale]);

	// Re-initialize if device locale changes (e.g., user changes system language)
	useEffect(() => {
		const updatedLocale = getInitialLocale();
		setLocaleState(updatedLocale);
	}, []);

	// Wrapper for `setLocale` to update the state based on a string input
	const setLocale = (languageTag: string) => {
		const updatedLocale: LocaleInfo = {
			...locale,
			languageTag,
			languageCode: languageTag.split("-")[0] || null,
		};
		setLocaleState(updatedLocale);

		// The i18n instance will be recreated via useMemo when linguiLocale changes
		// which happens when locale.languageCode changes
	};

	return (
		<I18nProvider i18n={linguiInstance} defaultComponent={DefaultComponent}>
			<LocaleContext.Provider value={{ locale, setLocale }}>
				{children}
			</LocaleContext.Provider>
		</I18nProvider>
	);
};
