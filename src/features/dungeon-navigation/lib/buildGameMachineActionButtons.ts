import type { DungeonContext, DungeonEvent } from "@/entities/dungeon";

import {
	NAVIGATION_ACTION_EVENTS,
	NAVIGATION_ACTION_LABELS,
	type NavigationActionEvent,
} from "../config";
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

type BuildGameMachineActionButtonsInput = {
	handleDungeonEventSend: (eventType: DungeonEvent) => void;
	navigationActionContext: GameMachineNavigationActionContext;
};

export const buildGameMachineActionButtons = ({
	handleDungeonEventSend,
	navigationActionContext,
}: BuildGameMachineActionButtonsInput): GameMachineActionButton[] =>
	NAVIGATION_ACTION_EVENTS.map((eventType) => ({
		eventType,
		label: NAVIGATION_ACTION_LABELS[eventType],
		isDisabled: getNavigationActionDisabled(eventType, navigationActionContext),
		handleDungeonActionTrigger: () => handleDungeonEventSend(eventType),
	}));

export type {
	BuildGameMachineActionButtonsInput,
	GameMachineActionButton,
	GameMachineNavigationActionContext,
};
