import type { ReactNode } from "react";

import { AudioProvider } from "./AudioProvider";
import { ConvexProvider } from "./ConvexProvider";
import { GameMachineProvider } from "./GameMachineProvider";

type AppProvidersProps = {
	children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
	return (
		<ConvexProvider>
			<GameMachineProvider>
				<AudioProvider>{children}</AudioProvider>
			</GameMachineProvider>
		</ConvexProvider>
	);
}

export { AudioProvider, ConvexProvider, GameMachineProvider };
