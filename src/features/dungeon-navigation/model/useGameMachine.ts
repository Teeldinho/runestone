import { useMachine } from "@xstate/react";
import { useCallback, useMemo } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import { ROOM_LABELS } from "@/entities/dungeon";

import {
	DUNGEON_MACHINE_SYSTEM_EVENTS,
	NAVIGATION_ACTION_EVENTS,
	NAVIGATION_ACTION_LABELS,
	type NavigationActionEvent,
} from "../config";
import { getNavigationActionDisabled } from "../lib/navigationActionAvailability";

import { createGameMachine } from "./gameMachine";

type GameActionButton = {
	eventType: NavigationActionEvent;
	label: string;
	isDisabled: boolean;
	handleDungeonActionTrigger: () => void;
};

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

	const actionButtons = useMemo<GameActionButton[]>(
		() =>
			NAVIGATION_ACTION_EVENTS.map((eventType) => ({
				eventType,
				label: NAVIGATION_ACTION_LABELS[eventType],
				isDisabled: getNavigationActionDisabled(eventType, snapshot.context),
				handleDungeonActionTrigger: () => handleDungeonEventSend(eventType),
			})),
		[snapshot.context, handleDungeonEventSend],
	);

	const currentRoomLabel = ROOM_LABELS[snapshot.context.currentRoomId];
	const discoveredRoomLabels = snapshot.context.discoveredRooms.map(
		(roomId) => ROOM_LABELS[roomId],
	);

	return {
		snapshot,
		currentRoomLabel,
		discoveredRoomLabels,
		actionButtons,
		handleDungeonEventSend,
		handleDungeonRunReset,
	};
};
