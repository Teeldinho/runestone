import type { ReactNode } from "react";

import { DungeonGameMachineProvider } from "@/features/dungeon-navigation";

type GameMachineProviderProps = {
	children: ReactNode;
};

export function GameMachineProvider({ children }: GameMachineProviderProps) {
	return <DungeonGameMachineProvider>{children}</DungeonGameMachineProvider>;
}
