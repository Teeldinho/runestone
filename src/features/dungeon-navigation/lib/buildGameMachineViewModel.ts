import type {
	DungeonContext,
	DungeonEvent,
	DungeonInteractableId,
	RoomId,
} from "@/entities/dungeon";
import { ROOM_LABELS } from "@/entities/dungeon";

import {
	NAVIGATION_ACTION_EVENTS,
	NAVIGATION_ACTION_LABELS,
	type NavigationActionEvent,
} from "../config";
import { formatNearInteractableLabel } from "./formatNearInteractableLabel";
import { getNavigationActionDisabled } from "./navigationActionAvailability";

type GameMachineNavigationActionContext = Pick<
	DungeonContext,
	"currentRoomId" | "enemiesRemaining" | "hasTreasureKey" | "nearInteractable"
>;

type GameMachineActionButton = {
	eventType: NavigationActionEvent;
	label: string;
	isDisabled: boolean;
	handleDungeonActionTrigger: () => void;
};

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
	const actionButtons: GameMachineActionButton[] = NAVIGATION_ACTION_EVENTS.map(
		(eventType) => ({
			eventType,
			label: NAVIGATION_ACTION_LABELS[eventType],
			isDisabled: getNavigationActionDisabled(
				eventType,
				input.navigationActionContext,
			),
			handleDungeonActionTrigger: () => input.handleDungeonEventSend(eventType),
		}),
	);

	return {
		machine: {
			activeStateLabel: input.activeStateLabel,
		},
		navigation: {
			actionButtons,
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
