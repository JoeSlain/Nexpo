import type { ReactNode } from "react";
import { TamaguiProvider } from "tamagui";
import { config } from "app/tamagui.config";

export default function TamaguiProviderComponent({
	children,
}: {
	children: ReactNode;
}) {
	return <TamaguiProvider config={config}>{children}</TamaguiProvider>;
}
