import { useMachine } from "@xstate/react";
import { useCallback, useMemo } from "react";

import type { DungeonEvent } from "@/entities/dungeon";

import {
	createGameMachine,
	DUNGEON_MACHINE_SYSTEM_EVENTS,
} from "./gameMachine";

export const useGameMachine = () => {
	const machine = useMemo(() => createGameMachine(), []);
	const [snapshot, sendDungeonMachineEvent] = useMachine(machine);

	const handleDungeonEventSend = useCallback(
		(eventType: DungeonEvent) => {
			sendDungeonMachineEvent({ type: eventType });
		},
		[sendDungeonMachineEvent],
	);

	const handleDungeonRunReset = useCallback(() => {
		sendDungeonMachineEvent({
			type: DUNGEON_MACHINE_SYSTEM_EVENTS.RESET_DUNGEON_RUN,
		});
	}, [sendDungeonMachineEvent]);

	return {
		snapshot,
		sendDungeonEvent: handleDungeonEventSend,
		resetDungeonRun: handleDungeonRunReset,
	};
};
