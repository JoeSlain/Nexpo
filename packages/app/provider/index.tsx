"use client";

import { SafeArea } from "app/provider/safe-area";
import { NavigationProvider } from "./navigation";
import TamaguiProvider from "./tamagui";

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<SafeArea>
			<TamaguiProvider>
				<NavigationProvider>{children}</NavigationProvider>
			</TamaguiProvider>
		</SafeArea>
	);
}
