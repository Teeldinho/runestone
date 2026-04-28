import { useCallback } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import { PLAYER_EVENTS, type PlayerMachineEvent } from "@/entities/player";
import {
	useInteractionCandidates,
	useInteractionInput,
} from "@/features/dungeon-navigation";
import type { Vector3Tuple } from "@/shared/lib";

type UseGamePageTouchInput = {
	handleDungeonEventSend: (event: DungeonEvent) => void;
	sendPlayerMachineEvent: (event: PlayerMachineEvent) => void;
};

type GamePageTouchViewModel = {
	handleTouchJoystickMove: (velocity: Vector3Tuple) => void;
	handleTouchJoystickStop: () => void;
	handleTouchAttack: () => void;
	handleTouchInteract: () => void;
	hasTouchAttack: boolean;
	hasTouchInteract: boolean;
	touchAttackPrompt: string | null;
	touchInteractPrompt: string | null;
};

export const useGamePageTouch = ({
	handleDungeonEventSend,
	sendPlayerMachineEvent,
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

	const handleTouchJoystickMove = useCallback(
		(velocity: Vector3Tuple) => {
			sendPlayerMachineEvent({
				type: PLAYER_EVENTS.MOVE,
				velocity,
				isSprinting: false,
			});
		},
		[sendPlayerMachineEvent],
	);

	const handleTouchJoystickStop = useCallback(() => {
		sendPlayerMachineEvent({ type: PLAYER_EVENTS.STOP });
	}, [sendPlayerMachineEvent]);

	return {
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		handleTouchAttack: touchInteractionHandlers.handleAttack,
		handleTouchInteract: touchInteractionHandlers.handleInteract,
		hasTouchAttack: interactionCandidates.hasAttack,
		hasTouchInteract: interactionCandidates.hasInteract,
		touchAttackPrompt: interactionCandidates.attackPrompt,
		touchInteractPrompt: interactionCandidates.interactPrompt,
	};
};

export type { GamePageTouchViewModel, UseGamePageTouchInput };
