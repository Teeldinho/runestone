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
import { useGameMachineRuntime } from "./gameMachineRuntime";

type GameActionButton = {
	eventType: NavigationActionEvent;
	label: string;
	isDisabled: boolean;
	handleDungeonActionTrigger: () => void;
};

export const useGameMachine = () => {
	const { snapshot, sendDungeonMachineEvent } = useGameMachineRuntime();

	const handleDungeonEventSend = useCallback(
		(eventType: DungeonEvent) => {
			sendDungeonMachineEvent({ type: eventType });
		},
		[sendDungeonMachineEvent],
	);

	const handleDoorTransition = useCallback(
		(eventType: NavigationActionEvent) => {
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
				handleDungeonActionTrigger: () => handleDoorTransition(eventType),
			})),
		[snapshot.context, handleDoorTransition],
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
