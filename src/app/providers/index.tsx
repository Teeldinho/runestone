import type { ReactNode } from "react";

import { AuthProvider } from "@/features/auth";

import { AudioProvider } from "./AudioProvider";
import { ConvexProvider } from "./ConvexProvider";
import { GameMachineProvider } from "./GameMachineProvider";

type AppProvidersProps = {
	children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
	return (
		<ConvexProvider>
			<AuthProvider>
				<GameMachineProvider>
					<AudioProvider>{children}</AudioProvider>
				</GameMachineProvider>
			</AuthProvider>
		</ConvexProvider>
	);
}

export { AudioProvider, ConvexProvider, GameMachineProvider };
