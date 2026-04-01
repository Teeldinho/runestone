import { useEffect, useState } from "react";

import type { DoorStateKey, DungeonEvent } from "@/entities/dungeon";
import {
	createFloorOneMachine,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";
import {
	createDungeonFloorLayout,
	type DungeonRoomLayout,
} from "@/entities/room";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import { ENEMY_CONFIG } from "@/shared/config";
import {
	getPlayerPosition,
	subscribeToPlayerPosition,
} from "@/shared/lib/playerPositionStore";
import type { Vector3Tuple } from "@/shared/types";

import { EMPTY_INTERACTION_CANDIDATES, INTERACTION_PROMPTS } from "../config";
import { resolveInteractionCandidates } from "../lib";

type InteractionCandidatesViewModel = {
	interactPrompt: string | null;
	interactEvent: (DungeonEvent & string) | null;
	attackPrompt: string | null;
	hasInteract: boolean;
	hasAttack: boolean;
};

const floorLayout = createDungeonFloorLayout(createFloorOneMachine());

const getEnemyPositions = (
	rooms: readonly DungeonRoomLayout[],
	guardRoomId: RoomId,
	enemyCount: number,
): Vector3Tuple[] => {
	const guardRoom = rooms.find((room) => room.roomId === guardRoomId);
	if (!guardRoom || enemyCount <= 0) {
		return [];
	}

	const [rx, ry, rz] = guardRoom.position;
	const spawnOffset = ENEMY_CONFIG.ATTACK_RADIUS * 0.8;

	const positions: Vector3Tuple[] = [[rx, ry + 1, rz]];

	if (enemyCount > 1) {
		positions.push([rx + spawnOffset, ry + 1, rz - spawnOffset]);
	}

	return positions.slice(0, enemyCount);
};

const getPromptText = (
	candidateType: string | null,
	candidateEvent: string | null,
): string | null => {
	if (!candidateEvent) {
		return null;
	}

	if (candidateType === "key") {
		return "Pick Up Key";
	}

	const prompt =
		INTERACTION_PROMPTS[candidateEvent as keyof typeof INTERACTION_PROMPTS];
	return prompt ?? null;
};

const computeCandidates = (
	currentRoomId: RoomId,
	hasTreasureKey: boolean,
	enemiesRemaining: number,
	openedDoors: DoorStateKey[],
	nearInteractable: DoorStateKey | null,
): InteractionCandidatesViewModel => {
	const playerPosition = getPlayerPosition();
	const enemyPositions = getEnemyPositions(
		floorLayout.rooms,
		ROOM_IDS.GUARD_ROOM,
		enemiesRemaining,
	);

	const candidates = resolveInteractionCandidates({
		currentRoomId,
		hasTreasureKey,
		enemiesRemaining,
		playerPosition,
		enemyPositions,
		openedDoors,
		nearInteractable,
	});

	const interactEvent = candidates.interact?.event ?? null;
	const interactPrompt = candidates.interact
		? getPromptText(candidates.interact.type, interactEvent)
		: null;

	const attackPrompt = candidates.attack ? "Attack" : null;

	return {
		interactPrompt,
		interactEvent: interactEvent as (DungeonEvent & string) | null,
		attackPrompt,
		hasInteract: interactPrompt !== null,
		hasAttack: attackPrompt !== null,
	};
};

type UseInteractionCandidatesInput = {
	currentRoomId: RoomId;
	hasTreasureKey: boolean;
	enemiesRemaining: number;
};

export const useInteractionCandidates = (
	input: UseInteractionCandidatesInput,
): InteractionCandidatesViewModel => {
	const { currentRoomId, hasTreasureKey, enemiesRemaining } = input;
	const { snapshot } = useGameMachineRuntime();

	const [candidates, setCandidates] = useState<InteractionCandidatesViewModel>(
		EMPTY_INTERACTION_CANDIDATES,
	);

	useEffect(() => {
		const openedDoors = snapshot.context.openedDoors;
		const nearInteractable = snapshot.context.nearInteractable;

		const compute = () =>
			computeCandidates(
				currentRoomId,
				hasTreasureKey,
				enemiesRemaining,
				openedDoors,
				nearInteractable,
			);

		const updateIfChanged = () => {
			setCandidates((prev) => {
				const next = compute();
				if (
					prev.interactPrompt === next.interactPrompt &&
					prev.attackPrompt === next.attackPrompt
				) {
					return prev;
				}
				return next;
			});
		};

		updateIfChanged();

		const unsubPosition = subscribeToPlayerPosition(updateIfChanged);

		return () => {
			unsubPosition?.();
		};
	}, [
		currentRoomId,
		hasTreasureKey,
		enemiesRemaining,
		snapshot.context.openedDoors,
		snapshot.context.nearInteractable,
	]);

	return candidates;
};

export type { InteractionCandidatesViewModel };
