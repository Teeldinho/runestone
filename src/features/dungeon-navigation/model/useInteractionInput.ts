import { useCallback, useEffect, useRef } from "react";

import type { DungeonEvent } from "@/entities/dungeon";
import { DUNGEON_EVENTS, type RoomId } from "@/entities/dungeon";
import { markDoorOpened } from "@/entities/room";

import { INTERACTION_KEYS } from "../config";
import { getDoorwayDetection } from "../lib";
import type { InteractionCandidatesViewModel } from "./useInteractionCandidates";

type UseInteractionInputOptions = {
	candidates: InteractionCandidatesViewModel;
	currentRoomId: RoomId;
	sendDungeonMachineEvent: (event: { type: DungeonEvent }) => void;
};

export const useInteractionInput = ({
	candidates,
	currentRoomId,
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
		}, 280);

		if (candidates.interactEvent) {
			const doorwayDetection = getDoorwayDetection();

			if (
				doorwayDetection &&
				!doorwayDetection.isLocked &&
				doorwayDetection.eventType === candidates.interactEvent
			) {
				markDoorOpened(currentRoomId, doorwayDetection.doorSide);
			}

			sendDungeonMachineEvent({
				type: candidates.interactEvent as DungeonEvent,
			});
		}
	}, [candidates, currentRoomId, sendDungeonMachineEvent]);

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
