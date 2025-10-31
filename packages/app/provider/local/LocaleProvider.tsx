import { createContext, useContext, useEffect, useState } from "react";
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

export const LocaleProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [locale, setLocaleState] = useState<LocaleInfo>(getInitialLocale);

	// Update locale if navigator changes (e.g., user changes browser language)
	useEffect(() => {
		const updatedLocale = getInitialLocale();
		setLocaleState(updatedLocale);
	}, []);

	// Wrapper for `setLocale`
	const setLocale = (languageTag: string) => {
		const updatedLocale: LocaleInfo = {
			...locale,
			languageTag,
			languageCode: languageTag.split("-")[0] || null,
		};
		setLocaleState(updatedLocale);
	};

	return (
		<LocaleContext.Provider value={{ locale, setLocale }}>
			{children}
		</LocaleContext.Provider>
	);
};
