import { useEffect, useState } from "react";
import type {
	DungeonEvent,
	DungeonInteractableId,
	RoomId,
} from "@/entities/dungeon";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import {
	getEnemyPositions,
	subscribeToEnemyPositions,
} from "@/shared/lib/enemyPositionStore";
import {
	getPlayerPosition,
	subscribeToPlayerPosition,
} from "@/shared/lib/playerPositionStore";
import type { Vector3Tuple } from "@/shared/types";

import { ATTACK_PROMPT, EMPTY_INTERACTION_CANDIDATES } from "../config";
import { resolveInteractionCandidates } from "../lib";

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
): InteractionCandidatesViewModel => {
	const playerPosition = getPlayerPosition();
	const enemyPositions = getEnemyPositions();

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
		const nearInteractable = snapshot.context.nearInteractable;

		const compute = () =>
			computeCandidates(
				currentRoomId,
				hasTreasureKey,
				enemiesRemaining,
				nearInteractable,
			);

		const updateIfChanged = () => {
			setCandidates((prev) => {
				const next = compute();
				if (
					prev.interactPrompt === next.interactPrompt &&
					prev.interactEvent === next.interactEvent &&
					prev.interactTargetId === next.interactTargetId &&
					prev.attackPrompt === next.attackPrompt &&
					prev.attackPosition?.[0] === next.attackPosition?.[0] &&
					prev.attackPosition?.[1] === next.attackPosition?.[1] &&
					prev.attackPosition?.[2] === next.attackPosition?.[2]
				) {
					return prev;
				}
				return next;
			});
		};

		updateIfChanged();

		const unsubPosition = subscribeToPlayerPosition(updateIfChanged);
		const unsubEnemyPositions = subscribeToEnemyPositions(updateIfChanged);

		return () => {
			unsubPosition?.();
			unsubEnemyPositions?.();
		};
	}, [
		currentRoomId,
		hasTreasureKey,
		enemiesRemaining,
		snapshot.context.nearInteractable,
	]);

	return candidates;
};

export type { InteractionCandidatesViewModel };
