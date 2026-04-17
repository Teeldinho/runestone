import { useMachine } from "@xstate/react";
import { useCallback, useEffect } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import { DUNGEON_EVENTS } from "@/entities/dungeon";

import {
	INTERACTION_COOLDOWN_MACHINE_EVENTS,
	INTERACTION_COOLDOWN_MACHINE_STATES,
	INTERACTION_KEYS,
} from "../config";
import { interactionCooldownMachine } from "./interactionCooldownMachine";
import type { InteractionCandidatesViewModel } from "./useInteractionCandidates";

type UseInteractionInputOptions = {
	candidates: InteractionCandidatesViewModel;
	sendDungeonMachineEvent: (event: { type: DungeonEvent }) => void;
	enableKeyboardBindings?: boolean;
};

type InteractionInputHandlers = {
	handleAttack: () => void;
	handleInteract: () => void;
};

export const useInteractionInput = ({
	candidates,
	sendDungeonMachineEvent,
	enableKeyboardBindings = true,
}: UseInteractionInputOptions): InteractionInputHandlers => {
	const [, sendCooldownEvent, cooldownActorRef] = useMachine(
		interactionCooldownMachine,
	);

	const handleInteract = useCallback(() => {
		if (
			cooldownActorRef
				.getSnapshot()
				.matches(INTERACTION_COOLDOWN_MACHINE_STATES.COOLDOWN) ||
			!candidates.hasInteract
		) {
			return;
		}

		sendCooldownEvent({
			type: INTERACTION_COOLDOWN_MACHINE_EVENTS.START_INTERACT,
		});

		if (candidates.interactEvent) {
			sendDungeonMachineEvent({
				type: candidates.interactEvent as DungeonEvent,
			});
		}
	}, [
		candidates,
		cooldownActorRef,
		sendCooldownEvent,
		sendDungeonMachineEvent,
	]);

	const handleAttack = useCallback(() => {
		if (
			cooldownActorRef
				.getSnapshot()
				.matches(INTERACTION_COOLDOWN_MACHINE_STATES.COOLDOWN) ||
			!candidates.hasAttack
		) {
			return;
		}

		sendCooldownEvent({
			type: INTERACTION_COOLDOWN_MACHINE_EVENTS.START_ATTACK,
		});

		sendDungeonMachineEvent({ type: DUNGEON_EVENTS.ENEMY_DIED });
	}, [
		candidates,
		cooldownActorRef,
		sendCooldownEvent,
		sendDungeonMachineEvent,
	]);

	useEffect(() => {
		if (!enableKeyboardBindings) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.repeat) return;

			if (event.key.toLowerCase() === INTERACTION_KEYS.INTERACT) {
				handleInteract();
			} else if (event.key.toLowerCase() === INTERACTION_KEYS.ATTACK) {
				handleAttack();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [enableKeyboardBindings, handleInteract, handleAttack]);

	return {
		handleAttack,
		handleInteract,
	};
};
