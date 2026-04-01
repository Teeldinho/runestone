import { useCallback, useEffect, useRef } from "react";
import { CORRIDOR_DIRECTIONS } from "@/entities/corridor";
import type { DoorStateKey, DungeonEvent } from "@/entities/dungeon";
import { buildDoorKey, DUNGEON_EVENTS, type RoomId } from "@/entities/dungeon";

import { INTERACTION_KEYS } from "../config";
import { useGameMachineRuntime } from "./gameMachineRuntime";
import type { InteractionCandidatesViewModel } from "./useInteractionCandidates";

type UseInteractionInputOptions = {
	candidates: InteractionCandidatesViewModel;
	currentRoomId: RoomId;
	sendDungeonMachineEvent: (event: {
		type: DungeonEvent;
		doorKey?: DoorStateKey;
	}) => void;
};

export const useInteractionInput = ({
	candidates,
	currentRoomId,
	sendDungeonMachineEvent,
}: UseInteractionInputOptions): void => {
	const { snapshot } = useGameMachineRuntime();
	const openedDoors = snapshot.context.openedDoors;
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
			const doorKey = candidates.interactEvent.includes("south")
				? buildDoorKey(currentRoomId, CORRIDOR_DIRECTIONS.SOUTH)
				: candidates.interactEvent.includes("north")
					? buildDoorKey(currentRoomId, CORRIDOR_DIRECTIONS.NORTH)
					: candidates.interactEvent.includes("east")
						? buildDoorKey(currentRoomId, CORRIDOR_DIRECTIONS.EAST)
						: candidates.interactEvent.includes("west")
							? buildDoorKey(currentRoomId, CORRIDOR_DIRECTIONS.WEST)
							: null;

			if (doorKey && !openedDoors.includes(doorKey)) {
				sendDungeonMachineEvent({
					type: DUNGEON_EVENTS.OPEN_DOOR,
					doorKey,
				});
			}

			sendDungeonMachineEvent({
				type: candidates.interactEvent as DungeonEvent,
			});
		}
	}, [candidates, currentRoomId, openedDoors, sendDungeonMachineEvent]);

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
