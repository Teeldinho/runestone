import { shallowEqual } from "@xstate/react";

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
import { resolveInteractionCandidates } from "./interactionResolver";

export type InteractionCandidatesViewModel = {
	interactPrompt: string | null;
	interactEvent: (DungeonEvent & string) | null;
	interactTargetId: DungeonInteractableId | null;
	attackPrompt: string | null;
	attackPosition: Vector3Tuple | null;
	hasInteract: boolean;
	hasAttack: boolean;
};

export type InteractionCandidatesContext = {
	currentRoomId: RoomId;
	hasTreasureKey: boolean;
	enemiesRemaining: number;
	nearInteractable: DungeonInteractableId | null;
};

export type InteractionCandidatesRuntimeApi = {
	subscribe: (listener: () => void) => () => void;
	getSnapshot: () => InteractionCandidatesViewModel;
};

export const computeInteractionCandidates = (
	context: InteractionCandidatesContext,
	playerPosition: Vector3Tuple,
	enemyPositions: readonly Vector3Tuple[],
): InteractionCandidatesViewModel => {
	const candidates = resolveInteractionCandidates({
		currentRoomId: context.currentRoomId,
		hasTreasureKey: context.hasTreasureKey,
		enemiesRemaining: context.enemiesRemaining,
		nearInteractable: context.nearInteractable,
		playerPosition,
		enemyPositions,
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

export const createInteractionCandidatesRuntime = (
	context: InteractionCandidatesContext,
): InteractionCandidatesRuntimeApi => {
	let cachedCandidates: InteractionCandidatesViewModel | null = null;

	const getSnapshot = (): InteractionCandidatesViewModel => {
		const nextCandidates = computeInteractionCandidates(
			context,
			getPlayerPositionSnapshot(),
			getEnemyPositions(),
		);

		if (cachedCandidates && shallowEqual(cachedCandidates, nextCandidates)) {
			return cachedCandidates;
		}

		cachedCandidates = nextCandidates;
		return cachedCandidates;
	};

	const subscribe = (listener: () => void): (() => void) => {
		const handleUpdate = () => {
			const current = cachedCandidates;
			const next = getSnapshot();
			if (current !== next) {
				listener();
			}
		};

		const unsubPlayer = subscribeToPlayerPosition(handleUpdate);
		const unsubEnemy = subscribeToEnemyPositions(handleUpdate);

		return () => {
			unsubPlayer();
			unsubEnemy();
		};
	};

	return { subscribe, getSnapshot };
};
