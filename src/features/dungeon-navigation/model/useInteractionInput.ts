import { useCallback, useEffect, useRef } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import { DUNGEON_EVENTS } from "@/entities/dungeon";

import { INTERACTION_COOLDOWN_MS, INTERACTION_KEYS } from "../config";
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
		if (cooldownRef.current || !candidates.hasInteract) {
			return;
		}

		cooldownRef.current = true;
		setTimeout(() => {
			cooldownRef.current = false;
		}, INTERACTION_COOLDOWN_MS.INTERACT);

		if (candidates.interactEvent) {
			sendDungeonMachineEvent({
				type: candidates.interactEvent as DungeonEvent,
			});
		}
	}, [candidates, sendDungeonMachineEvent]);

	const handleAttack = useCallback(() => {
		if (cooldownRef.current || !candidates.hasAttack) {
			return;
		}

		cooldownRef.current = true;
		setTimeout(() => {
			cooldownRef.current = false;
		}, INTERACTION_COOLDOWN_MS.ATTACK);

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
