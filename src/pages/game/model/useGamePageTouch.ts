import { useCallback } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import {
	useInteractionCandidates,
	useInteractionInput,
} from "@/features/dungeon-navigation";

type UseGamePageTouchInput = {
	handleDungeonEventSend: (event: DungeonEvent) => void;
};

type GamePageTouchViewModel = {
	handleTouchAttack: () => void;
	handleTouchInteract: () => void;
	hasTouchAttack: boolean;
	hasTouchInteract: boolean;
	touchAttackPrompt: string | null;
	touchInteractPrompt: string | null;
};

export const useGamePageTouch = ({
	handleDungeonEventSend,
}: UseGamePageTouchInput): GamePageTouchViewModel => {
	const interactionCandidates = useInteractionCandidates();

	const sendDungeonMachineEvent = useCallback(
		(event: { type: DungeonEvent }) => {
			handleDungeonEventSend(event.type);
		},
		[handleDungeonEventSend],
	);

	const touchInteractionHandlers = useInteractionInput({
		candidates: interactionCandidates,
		enableKeyboardBindings: false,
		sendDungeonMachineEvent,
	});

	return {
		handleTouchAttack: touchInteractionHandlers.handleAttack,
		handleTouchInteract: touchInteractionHandlers.handleInteract,
		hasTouchAttack: interactionCandidates.hasAttack,
		hasTouchInteract: interactionCandidates.hasInteract,
		touchAttackPrompt: interactionCandidates.attackPrompt,
		touchInteractPrompt: interactionCandidates.interactPrompt,
	};
};

export type { GamePageTouchViewModel, UseGamePageTouchInput };
