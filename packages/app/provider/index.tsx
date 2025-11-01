"use client";

import { SafeArea } from "app/provider/safe-area";
import { NavigationProvider } from "./navigation";
import TamaguiProvider from "./tamagui";
import { LocaleProvider } from "./local/LocaleProvider";

export function Provider({
	children,
	locale,
}: {
	children: React.ReactNode;
	locale?: string;
}) {
	return (
		<LocaleProvider initialLocale={locale}>
			<SafeArea>
				<TamaguiProvider>
					<NavigationProvider>{children}</NavigationProvider>
				</TamaguiProvider>
			</SafeArea>
		</LocaleProvider>
	);
}
