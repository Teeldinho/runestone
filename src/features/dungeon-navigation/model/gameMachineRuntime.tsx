import { useMachine } from "@xstate/react";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

import {
	GAME_MACHINE_RUNTIME_ERRORS,
	type GameMachineEvent,
} from "@/features/dungeon-navigation/config";

import { createGameMachine } from "./gameMachine";

type DungeonMachineSnapshot = ReturnType<
	ReturnType<typeof createGameMachine>["getInitialSnapshot"]
>;

type GameMachineRuntimeContextValue = {
	sendDungeonMachineEvent: (event: GameMachineEvent) => void;
	snapshot: DungeonMachineSnapshot;
};

type DungeonGameMachineProviderProps = {
	children: ReactNode;
};

const gameMachineRuntimeContext =
	createContext<GameMachineRuntimeContextValue | null>(null);

export const DungeonGameMachineProvider = ({
	children,
}: DungeonGameMachineProviderProps) => {
	const machine = useMemo(() => createGameMachine(), []);
	const [snapshot, sendDungeonMachineEvent] = useMachine(machine);

	const gameMachineRuntimeContextValue = useMemo(
		() => ({
			sendDungeonMachineEvent,
			snapshot,
		}),
		[sendDungeonMachineEvent, snapshot],
	);

	return (
		<gameMachineRuntimeContext.Provider value={gameMachineRuntimeContextValue}>
			{children}
		</gameMachineRuntimeContext.Provider>
	);
};

export const useGameMachineRuntime = (): GameMachineRuntimeContextValue => {
	const context = useContext(gameMachineRuntimeContext);

	if (!context) {
		throw new Error(GAME_MACHINE_RUNTIME_ERRORS.MISSING_PROVIDER);
	}

	return context;
};
