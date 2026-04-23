import { shallowEqual } from "@xstate/react";
import { useCallback, useMemo } from "react";

import type { DungeonEvent } from "@/entities/dungeon";

import { DUNGEON_MACHINE_SYSTEM_EVENTS } from "../config";
import { createGameMachineViewModel } from "../lib";
import {
	selectActiveStateLabel,
	selectCurrentRoomId,
	selectDiscoveredRooms,
	selectEnemiesRemaining,
	selectHasTreasureKey,
	selectNavigationActionContext,
	selectNearInteractable,
	useGameMachineSelector,
	useSendDungeonMachineEvent,
} from "./gameMachineRuntime";

export const useGameMachine = () => {
	const sendDungeonMachineEvent = useSendDungeonMachineEvent();
	const activeStateLabel = useGameMachineSelector(selectActiveStateLabel);
	const currentRoomId = useGameMachineSelector(selectCurrentRoomId);
	const discoveredRooms = useGameMachineSelector(selectDiscoveredRooms);
	const enemiesRemaining = useGameMachineSelector(selectEnemiesRemaining);
	const hasTreasureKey = useGameMachineSelector(selectHasTreasureKey);
	const nearInteractable = useGameMachineSelector(selectNearInteractable);
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

	const handleDungeonRunReset = useCallback(() => {
		sendDungeonMachineEvent({
			type: DUNGEON_MACHINE_SYSTEM_EVENTS.RESET_DUNGEON_RUN,
		});
	}, [sendDungeonMachineEvent]);

	return useMemo(
		() =>
			createGameMachineViewModel({
				activeStateLabel,
				currentRoomId,
				discoveredRooms,
				enemiesRemaining,
				handleDungeonEventSend,
				handleDungeonRunReset,
				hasTreasureKey,
				nearInteractable,
				navigationActionContext,
			}),
		[
			activeStateLabel,
			currentRoomId,
			discoveredRooms,
			enemiesRemaining,
			handleDungeonEventSend,
			handleDungeonRunReset,
			hasTreasureKey,
			nearInteractable,
			navigationActionContext,
		],
	);
};
