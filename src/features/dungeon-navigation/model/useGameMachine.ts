import { shallowEqual } from "@xstate/react";
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
import {
	selectActiveStateLabel,
	selectCurrentRoomId,
	selectDiscoveredRooms,
	selectEnemiesRemaining,
	selectHasTreasureKey,
	selectNavigationActionContext,
	useGameMachineSelector,
	useSendDungeonMachineEvent,
} from "./gameMachineRuntime";

type GameActionButton = {
	eventType: NavigationActionEvent;
	label: string;
	isDisabled: boolean;
	handleDungeonActionTrigger: () => void;
};

export const useGameMachine = () => {
	const sendDungeonMachineEvent = useSendDungeonMachineEvent();
	const activeStateLabel = useGameMachineSelector(selectActiveStateLabel);
	const currentRoomId = useGameMachineSelector(selectCurrentRoomId);
	const discoveredRooms = useGameMachineSelector(selectDiscoveredRooms);
	const enemiesRemaining = useGameMachineSelector(selectEnemiesRemaining);
	const hasTreasureKey = useGameMachineSelector(selectHasTreasureKey);
	const navigationActionContext = useGameMachineSelector(
		selectNavigationActionContext,
		shallowEqual,
	);

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
				isDisabled: getNavigationActionDisabled(
					eventType,
					navigationActionContext,
				),
				handleDungeonActionTrigger: () => handleDoorTransition(eventType),
			})),
		[navigationActionContext, handleDoorTransition],
	);

	const currentRoomLabel = ROOM_LABELS[currentRoomId];
	const discoveredRoomLabels = discoveredRooms.map(
		(roomId) => ROOM_LABELS[roomId],
	);

	return {
		activeStateLabel,
		currentRoomLabel,
		currentRoomId,
		discoveredRoomLabels,
		discoveredRooms,
		enemiesRemaining,
		actionButtons,
		handleDungeonEventSend,
		handleDungeonRunReset,
		hasTreasureKey,
	};
};
