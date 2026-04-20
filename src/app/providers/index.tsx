import type { ReactNode } from "react";

import { AuthProvider } from "@/features/auth";
import { TooltipProvider } from "@/shared/ui";

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
					<AudioProvider>
						<TooltipProvider>{children}</TooltipProvider>
					</AudioProvider>
				</GameMachineProvider>
			</AuthProvider>
		</ConvexProvider>
	);
}

export { AudioProvider, ConvexProvider, GameMachineProvider };
