import type {
	DungeonEvent,
	DungeonInteractableId,
	RoomId,
} from "@/entities/dungeon";
import { ROOM_LABELS } from "@/entities/dungeon";

import { formatNearInteractableLabel } from "./formatNearInteractableLabel";
import {
	buildGameMachineActionButtons,
	type GameMachineActionButton,
	type GameMachineNavigationActionContext,
} from "./buildGameMachineActionButtons";

type GameMachineViewModelInput = {
	activeStateLabel: string;
	currentRoomId: RoomId;
	discoveredRooms: RoomId[];
	enemiesRemaining: number;
	hasTreasureKey: boolean;
	nearInteractable: DungeonInteractableId | null;
	navigationActionContext: GameMachineNavigationActionContext;
	handleDungeonEventSend: (eventType: DungeonEvent) => void;
	handleDungeonRunReset: () => void;
};

type GameMachineViewModel = {
	machine: {
		activeStateLabel: string;
	};
	navigation: {
		actionButtons: GameMachineActionButton[];
		handleDungeonEventSend: (eventType: DungeonEvent) => void;
		handleDungeonRunReset: () => void;
	};
	room: {
		currentRoomId: RoomId;
		currentRoomLabel: string;
		discoveredRooms: RoomId[];
		discoveredRoomLabels: string[];
	};
	status: {
		enemiesRemaining: number;
		hasTreasureKey: boolean;
		nearInteractableLabel: string;
	};
};

export const createGameMachineViewModel = (
	input: GameMachineViewModelInput,
): GameMachineViewModel => {
	return {
		machine: {
			activeStateLabel: input.activeStateLabel,
		},
		navigation: {
			actionButtons: buildGameMachineActionButtons({
				handleDungeonEventSend: input.handleDungeonEventSend,
				navigationActionContext: input.navigationActionContext,
			}),
			handleDungeonEventSend: input.handleDungeonEventSend,
			handleDungeonRunReset: input.handleDungeonRunReset,
		},
		room: {
			currentRoomId: input.currentRoomId,
			currentRoomLabel: ROOM_LABELS[input.currentRoomId],
			discoveredRooms: input.discoveredRooms,
			discoveredRoomLabels: input.discoveredRooms.map(
				(roomId) => ROOM_LABELS[roomId],
			),
		},
		status: {
			enemiesRemaining: input.enemiesRemaining,
			hasTreasureKey: input.hasTreasureKey,
			nearInteractableLabel: formatNearInteractableLabel(
				input.nearInteractable,
			),
		},
	};
};

export type {
	GameMachineActionButton,
	GameMachineNavigationActionContext,
	GameMachineViewModel,
	GameMachineViewModelInput,
};
