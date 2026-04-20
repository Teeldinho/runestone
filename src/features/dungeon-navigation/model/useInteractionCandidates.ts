import { shallowEqual } from "@xstate/react";
import { useEffect, useState } from "react";
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

	const [candidates, setCandidates] = useState<InteractionCandidatesViewModel>(
		() =>
			computeCandidates(
				currentRoomId,
				hasTreasureKey,
				enemiesRemaining,
				nearInteractable,
				getPlayerPositionSnapshot(),
				getEnemyPositions(),
			),
	);

	useEffect(() => {
		const checkCandidates = () => {
			const nextCandidates = computeCandidates(
				currentRoomId,
				hasTreasureKey,
				enemiesRemaining,
				nearInteractable,
				getPlayerPositionSnapshot(),
				getEnemyPositions(),
			);

			setCandidates((prev) => {
				if (shallowEqual(prev, nextCandidates)) {
					return prev;
				}
				return nextCandidates;
			});
		};

		checkCandidates();

		const unsubPlayer = subscribeToPlayerPosition(checkCandidates);
		const unsubEnemy = subscribeToEnemyPositions(checkCandidates);

		return () => {
			unsubPlayer();
			unsubEnemy();
		};
	}, [currentRoomId, enemiesRemaining, hasTreasureKey, nearInteractable]);

	return candidates;
};

export type { InteractionCandidatesViewModel };
