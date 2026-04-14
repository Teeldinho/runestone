import { useCallback } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import { PLAYER_EVENTS, usePlayerMachineRuntime } from "@/entities/player";
import {
	useGameMachine,
	useInteractionCandidates,
	useInteractionInput,
} from "@/features/dungeon-navigation";
import type { Vector3Tuple } from "@/shared/lib";

export const useGamePageTouch = () => {
	const { handleDungeonEventSend } = useGameMachine();
	const { sendPlayerMachineEvent } = usePlayerMachineRuntime();
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
		hasTouchAttack: candidates.hasAttack,
		hasTouchInteract: candidates.hasInteract,
		touchAttackPrompt: candidates.attackPrompt,
		touchInteractPrompt: candidates.interactPrompt,
		handleTouchAttack: touchInteractionHandlers.handleAttack,
		handleTouchInteract: touchInteractionHandlers.handleInteract,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
	};
};
