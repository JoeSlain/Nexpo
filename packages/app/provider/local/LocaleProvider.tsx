import { setupI18n } from "@lingui/core";
import { I18nProvider, type TransRenderProps } from "@lingui/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { FC, ReactNode } from "react";

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

// Helper function to get initial locale from browser
function getInitialLocale(): LocaleInfo {
	// Check if we're on the client side (browser)
	if (typeof window === "undefined" || typeof navigator === "undefined") {
		return {
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
		};
	}

	const userLanguage = navigator.language;
	const [languageCode, regionCode] = userLanguage.split("-");
	const formatter = new Intl.NumberFormat(userLanguage);

	return {
		languageTag: userLanguage,
		languageCode: languageCode || null,
		regionCode: regionCode || null,
		currencyCode: formatter.resolvedOptions().currency || null,
		currencySymbol:
			formatter.formatToParts(1).find((part) => part.type === "currency")
				?.value || null,
		decimalSeparator:
			formatter.formatToParts(1.1).find((part) => part.type === "decimal")
				?.value || null,
		digitGroupingSeparator:
			formatter.formatToParts(1000).find((part) => part.type === "group")
				?.value || null,
		textDirection:
			languageCode && ["ar", "he", "fa", "ur"].includes(languageCode)
				? "rtl"
				: "ltr",
		measurementSystem:
			regionCode === "US" ? "us" : regionCode === "UK" ? "uk" : "metric",
		temperatureUnit: regionCode === "US" ? "fahrenheit" : "celsius",
	};
}

// Helper function to get supported Lingui locale
function getLinguiLocale(languageCode: string | null): string {
	const supportedLocales = ["en", "cs", "fr"];
	if (!languageCode) return "en";

	// Use the language code part for Lingui (e.g., 'en' from 'en-US')
	return supportedLocales.includes(languageCode) ? languageCode : "en";
}

// Default component for Trans macro (div component for web)
const DefaultComponent = ({ children }: TransRenderProps) => {
	return <>{children}</>;
};

export const LocaleProvider: FC<{
	children: ReactNode;
	initialLocale?: string; // Optional locale from route params (e.g., 'en', 'fr')
}> = ({ children, initialLocale }) => {
	// Use a consistent default locale for SSR/hydration to avoid mismatches
	const defaultLocale: LocaleInfo = {
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
	};

	const [locale, setLocaleState] = useState<LocaleInfo>(() => {
		// For SSR, use initialLocale if provided, otherwise default
		if (initialLocale) {
			const [languageCode, regionCode] = initialLocale.split("-");
			return {
				languageTag: initialLocale,
				languageCode: languageCode || null,
				regionCode: regionCode || null,
				currencyCode: null,
				currencySymbol: null,
				decimalSeparator: ".",
				digitGroupingSeparator: ",",
				textDirection:
					languageCode && ["ar", "he", "fa", "ur"].includes(languageCode)
						? "rtl"
						: "ltr",
				measurementSystem:
					regionCode === "US" ? "us" : regionCode === "UK" ? "uk" : "metric",
				temperatureUnit: regionCode === "US" ? "fahrenheit" : "celsius",
			};
		}
		return defaultLocale;
	});

	// Update locale from route param or browser after hydration to avoid SSR mismatch
	useEffect(() => {
		if (initialLocale) {
			const [languageCode, regionCode] = initialLocale.split("-");
			// Use browser locale info for formatting if available
			const browserLocale =
				typeof navigator !== "undefined" ? navigator.language : initialLocale;
			const formatter = new Intl.NumberFormat(browserLocale);

			const updatedLocale: LocaleInfo = {
				languageTag: initialLocale,
				languageCode: languageCode || null,
				regionCode: regionCode || null,
				currencyCode: formatter.resolvedOptions().currency || null,
				currencySymbol:
					formatter.formatToParts(1).find((part) => part.type === "currency")
						?.value || null,
				decimalSeparator:
					formatter.formatToParts(1.1).find((part) => part.type === "decimal")
						?.value || null,
				digitGroupingSeparator:
					formatter.formatToParts(1000).find((part) => part.type === "group")
						?.value || null,
				textDirection:
					languageCode && ["ar", "he", "fa", "ur"].includes(languageCode)
						? "rtl"
						: "ltr",
				measurementSystem:
					regionCode === "US" ? "us" : regionCode === "UK" ? "uk" : "metric",
				temperatureUnit: regionCode === "US" ? "fahrenheit" : "celsius",
			};
			setLocaleState(updatedLocale);
		} else {
			const updatedLocale = getInitialLocale();
			setLocaleState(updatedLocale);
		}
	}, [initialLocale]);

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

	// Wrapper for `setLocale`
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
