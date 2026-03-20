import type { ReactNode } from "react";

type GameMachineProviderProps = {
	children: ReactNode;
};

export function GameMachineProvider({ children }: GameMachineProviderProps) {
	return children;
}
