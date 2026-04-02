import type { ReactNode } from "react";

import { PlayerMachineProvider } from "@/entities/player";
import { DungeonGameMachineProvider } from "@/features/dungeon-navigation";

type GameMachineProviderProps = {
	children: ReactNode;
};

export function GameMachineProvider({ children }: GameMachineProviderProps) {
	return (
		<DungeonGameMachineProvider>
			<PlayerMachineProvider>{children}</PlayerMachineProvider>
		</DungeonGameMachineProvider>
	);
}
