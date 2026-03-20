import { useMachine } from "@xstate/react";
import { useCallback, useMemo } from "react";

import type { DungeonContext, DungeonEvent } from "@/entities/dungeon";
import { DUNGEON_EVENTS, ROOM_IDS } from "@/entities/dungeon";

import {
	NAVIGATION_ACTION_EVENTS,
	NAVIGATION_ACTION_LABELS,
	type NavigationActionEvent,
	ROOM_LABELS,
} from "../config";

import {
	createGameMachine,
	DUNGEON_MACHINE_SYSTEM_EVENTS,
} from "./gameMachine";

type GameActionButton = {
	eventType: NavigationActionEvent;
	label: string;
	isDisabled: boolean;
	handleAction: () => void;
};

const isActionDisabled = (
	eventType: NavigationActionEvent,
	context: DungeonContext,
): boolean => {
	switch (eventType) {
		case DUNGEON_EVENTS.ENTER_LIBRARY:
			return context.currentRoomId !== ROOM_IDS.ENTRANCE;
		case DUNGEON_EVENTS.ENTER_GUARD_ROOM:
			return context.currentRoomId !== ROOM_IDS.LIBRARY;
		case DUNGEON_EVENTS.PICK_UP_KEY:
			return (
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM || context.hasTreasureKey
			);
		case DUNGEON_EVENTS.ENEMY_DIED:
			return (
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM ||
				context.enemiesRemaining === 0
			);
		case DUNGEON_EVENTS.ENTER_TREASURY:
			return (
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM ||
				!context.hasTreasureKey ||
				context.enemiesRemaining > 0
			);
		case DUNGEON_EVENTS.ENTER_EXIT:
			return (
				context.currentRoomId !== ROOM_IDS.TREASURY || !context.hasTreasureKey
			);
		case DUNGEON_EVENTS.RETURN_TO_ENTRANCE:
			return (
				context.currentRoomId !== ROOM_IDS.LIBRARY &&
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM
			);
		case DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM:
			return (
				context.currentRoomId !== ROOM_IDS.TREASURY &&
				context.currentRoomId !== ROOM_IDS.EXIT
			);
		default:
			return true;
	}
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
				isDisabled: isActionDisabled(eventType, snapshot.context),
				handleAction: () => handleDungeonEventSend(eventType),
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
		sendDungeonEvent: handleDungeonEventSend,
		resetDungeonRun: handleDungeonRunReset,
	};
};
