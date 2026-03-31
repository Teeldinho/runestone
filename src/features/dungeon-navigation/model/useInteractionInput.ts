import { useCallback, useEffect, useRef } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import { DUNGEON_EVENTS } from "@/entities/dungeon";

import { INTERACTION_KEYS } from "../config";
import type { InteractionCandidatesViewModel } from "./useInteractionCandidates";

type UseInteractionInputOptions = {
	candidates: InteractionCandidatesViewModel;
	sendDungeonMachineEvent: (event: { type: DungeonEvent }) => void;
};

export const useInteractionInput = ({
	candidates,
	sendDungeonMachineEvent,
}: UseInteractionInputOptions): void => {
	const cooldownRef = useRef(false);

	const handleInteract = useCallback(() => {
		if (
			cooldownRef.current ||
			!candidates.hasInteract ||
			!candidates.interactPrompt
		) {
			return;
		}

		cooldownRef.current = true;
		setTimeout(() => {
			cooldownRef.current = false;
		}, 280);

		if (candidates.interactPrompt === "Pick Up Key") {
			sendDungeonMachineEvent({ type: DUNGEON_EVENTS.PICK_UP_KEY });
		} else if (candidates.interactPrompt === "Enter Treasury") {
			sendDungeonMachineEvent({ type: DUNGEON_EVENTS.ENTER_TREASURY });
		} else if (candidates.interactPrompt === "Exit Floor") {
			sendDungeonMachineEvent({ type: DUNGEON_EVENTS.ENTER_EXIT });
		}
	}, [candidates, sendDungeonMachineEvent]);

	const handleAttack = useCallback(() => {
		if (cooldownRef.current || !candidates.hasAttack) {
			return;
		}

		cooldownRef.current = true;
		setTimeout(() => {
			cooldownRef.current = false;
		}, 1200);

		sendDungeonMachineEvent({ type: DUNGEON_EVENTS.ENEMY_DIED });
	}, [candidates, sendDungeonMachineEvent]);

	useEffect(() => {
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
	}, [handleInteract, handleAttack]);
};
