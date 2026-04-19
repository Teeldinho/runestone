import { shallowEqual } from "@xstate/react";
import { useMemo, useSyncExternalStore } from "react";
import type {
	DungeonEvent,
	DungeonInteractableId,
	RoomId,
} from "@/entities/dungeon";
import type { Vector3Tuple } from "@/shared/lib";
import {
	getEnemyPositions,
	getPlayerPositionSnapshot,
	subscribeToEnemyPositions,
	subscribeToPlayerPosition,
} from "@/shared/model";

import { ATTACK_PROMPT } from "../config";
import { resolveInteractionCandidates } from "../lib";
import {
	selectInteractionCandidatesContext,
	useGameMachineSelector,
} from "./gameMachineRuntime";

type InteractionCandidatesViewModel = {
	interactPrompt: string | null;
	interactEvent: (DungeonEvent & string) | null;
	interactTargetId: DungeonInteractableId | null;
	attackPrompt: string | null;
	attackPosition: Vector3Tuple | null;
	hasInteract: boolean;
	hasAttack: boolean;
};

const computeCandidates = (
	currentRoomId: RoomId,
	hasTreasureKey: boolean,
	enemiesRemaining: number,
	nearInteractable: DungeonInteractableId | null,
	playerPosition: Vector3Tuple,
	enemyPositions: readonly Vector3Tuple[],
): InteractionCandidatesViewModel => {
	const candidates = resolveInteractionCandidates({
		currentRoomId,
		hasTreasureKey,
		enemiesRemaining,
		playerPosition,
		enemyPositions,
		nearInteractable,
	});

	const interactEvent = candidates.interact?.event ?? null;
	const interactPrompt = candidates.interact?.prompt ?? null;
	const interactTargetId = candidates.interact?.interactableId ?? null;

	const attackPrompt = candidates.attack ? ATTACK_PROMPT : null;
	const attackPosition = candidates.attack?.position ?? null;

	return {
		interactPrompt,
		interactEvent: interactEvent as (DungeonEvent & string) | null,
		interactTargetId,
		attackPrompt,
		attackPosition,
		hasInteract: interactPrompt !== null,
		hasAttack: attackPrompt !== null,
	};
};

export const useInteractionCandidates = (): InteractionCandidatesViewModel => {
	const { currentRoomId, enemiesRemaining, hasTreasureKey, nearInteractable } =
		useGameMachineSelector(selectInteractionCandidatesContext, shallowEqual);
	const playerPosition = useSyncExternalStore(
		subscribeToPlayerPosition,
		getPlayerPositionSnapshot,
	);
	const enemyPositions = useSyncExternalStore(
		subscribeToEnemyPositions,
		getEnemyPositions,
	);

	return useMemo(
		() =>
			computeCandidates(
				currentRoomId,
				hasTreasureKey,
				enemiesRemaining,
				nearInteractable,
				playerPosition,
				enemyPositions,
			),
		[
			currentRoomId,
			hasTreasureKey,
			enemiesRemaining,
			nearInteractable,
			playerPosition,
			enemyPositions,
		],
	);
};

export type { InteractionCandidatesViewModel };
