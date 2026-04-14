import { useCallback } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import {
	useGameMachine,
	useInteractionCandidates,
	useInteractionInput,
} from "@/features/dungeon-navigation";

export const useGamePageTouch = () => {
	const { handleDungeonEventSend } = useGameMachine();
	const candidates = useInteractionCandidates();
	const touchInteractionHandlers = useInteractionInput({
		candidates,
		enableKeyboardBindings: false,
		sendDungeonMachineEvent: useCallback(
			(event: { type: DungeonEvent }) => {
				handleDungeonEventSend(event.type);
			},
			[handleDungeonEventSend],
		),
	});

	return {
		hasTouchAttack: candidates.hasAttack,
		hasTouchInteract: candidates.hasInteract,
		touchAttackPrompt: candidates.attackPrompt,
		touchInteractPrompt: candidates.interactPrompt,
		handleTouchAttack: touchInteractionHandlers.handleAttack,
		handleTouchInteract: touchInteractionHandlers.handleInteract,
	};
};
