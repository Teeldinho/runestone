import { useMachine } from "@xstate/react";
import { createContext, type ReactNode, useContext, useMemo } from "react";

import { PLAYER_MACHINE_RUNTIME_ERRORS } from "../config";
import { createPlayerMachine } from "./playerMachine";
import type { PlayerMachineEvent } from "./types";

type PlayerMachineSnapshot = ReturnType<
	ReturnType<typeof createPlayerMachine>["getInitialSnapshot"]
>;

type PlayerMachineRuntimeContextValue = {
	sendPlayerMachineEvent: (event: PlayerMachineEvent) => void;
	snapshot: PlayerMachineSnapshot;
};

type PlayerMachineProviderProps = {
	children: ReactNode;
};

const playerMachineRuntimeContext =
	createContext<PlayerMachineRuntimeContextValue | null>(null);

export const PlayerMachineProvider = ({
	children,
}: PlayerMachineProviderProps) => {
	const machine = useMemo(() => createPlayerMachine(), []);
	const [snapshot, sendPlayerMachineEvent] = useMachine(machine);

	const value = useMemo(
		() => ({ sendPlayerMachineEvent, snapshot }),
		[sendPlayerMachineEvent, snapshot],
	);

	return (
		<playerMachineRuntimeContext.Provider value={value}>
			{children}
		</playerMachineRuntimeContext.Provider>
	);
};

export const usePlayerMachineRuntime = (): PlayerMachineRuntimeContextValue => {
	const context = useContext(playerMachineRuntimeContext);

	if (!context) {
		throw new Error(PLAYER_MACHINE_RUNTIME_ERRORS.MISSING_PROVIDER);
	}

	return context;
};

export type { PlayerMachineSnapshot };
