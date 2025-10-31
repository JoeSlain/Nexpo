"use client";

import { SafeArea } from "app/provider/safe-area";
import { NavigationProvider } from "./navigation";
import TamaguiProvider from "./tamagui";
import { LocaleProvider } from "./local/LocaleProvider";

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<LocaleProvider>
			<SafeArea>
				<TamaguiProvider>
					<NavigationProvider>{children}</NavigationProvider>
				</TamaguiProvider>
			</SafeArea>
		</LocaleProvider>
	);
}
