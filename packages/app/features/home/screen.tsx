"use client";

import { TextLink } from "solito/link";
import { View } from "react-native";
import { Text } from "tamagui";
import { useLocale } from "app/provider/local/LocaleProvider";

export function HomeScreen() {
	const { locale } = useLocale();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 16,
				gap: 32,
			}}
		>
			<H1>Welcome to Solito.</H1>
			<View style={{ maxWidth: 600, gap: 16 }}>
				<Text style={{ textAlign: "center" }}>
					Here is a basic starter to show you how you can navigate from one
					screen to another. This screen uses the same code on Next.js and React
					Native.
				</Text>
				<Text style={{ textAlign: "center" }}>
					Solito is made by{" "}
					<TextLink
						href="https://twitter.com/fernandotherojo"
						target="_blank"
						rel="noreferrer"
						style={{ color: "blue" }}
					>
						Fernando Rojo
					</TextLink>
					.
				</Text>
			</View>
			<View style={{ maxWidth: 600, gap: 8, marginTop: 16 }}>
				<Text style={{ textAlign: "center", fontSize: 14, fontWeight: "600" }}>
					Locale Information:
				</Text>
				<Text style={{ textAlign: "center", fontSize: 12 }}>
					Language: {locale.languageTag} ({locale.languageCode})
					{locale.regionCode && ` - Region: ${locale.regionCode}`}
				</Text>
				{locale.currencyCode && (
					<Text style={{ textAlign: "center", fontSize: 12 }}>
						Currency: {locale.currencySymbol} ({locale.currencyCode})
					</Text>
				)}
				<Text style={{ textAlign: "center", fontSize: 12 }}>
					Measurement: {locale.measurementSystem} • Temperature:{" "}
					{locale.temperatureUnit}
				</Text>
			</View>
			<View style={{ flexDirection: "row", gap: 32 }}>
				<TextLink
					href="/users/fernando"
					style={{
						fontSize: 16,
						fontWeight: "bold",
						color: "blue",
					}}
				>
					Link
				</TextLink>
			</View>
		</View>
	);
}

const H1 = ({ children }: { children: React.ReactNode }) => {
	return <Text style={{ fontWeight: "800", fontSize: 24 }}>{children}</Text>;
};
