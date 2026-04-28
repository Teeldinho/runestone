import {
	DUNGEON_EVENTS,
	DUNGEON_INTERACTABLE_IDS,
	type DungeonInteractableId,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";
import { ENEMY_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

import {
	DOOR_GUARDS,
	DOORWAY_INTERACTIONS_BY_ROOM,
	INTERACTION_CANDIDATE_TYPES,
	INTERACTION_PROMPTS,
} from "../config";

type InteractType =
	(typeof INTERACTION_CANDIDATE_TYPES)[keyof typeof INTERACTION_CANDIDATE_TYPES];

type InteractCandidate = {
	type: InteractType;
	event: (typeof DUNGEON_EVENTS)[keyof typeof DUNGEON_EVENTS];
	interactableId: DungeonInteractableId;
	prompt: string;
};

type AttackCandidate = {
	type: typeof INTERACTION_CANDIDATE_TYPES.ENEMY;
	distance: number;
	position: Vector3Tuple;
};

type InteractionCandidates = {
	interact: InteractCandidate | null;
	attack: AttackCandidate | null;
};

type ResolveInput = {
	currentRoomId: RoomId;
	hasTreasureKey: boolean;
	enemiesRemaining: number;
	playerPosition: Vector3Tuple;
	enemyPositions: readonly Vector3Tuple[];
	nearInteractable: DungeonInteractableId | null;
};

const distance = (a: Vector3Tuple, b: Vector3Tuple): number => {
	const dx = a[0] - b[0];
	const dy = a[1] - b[1];
	const dz = a[2] - b[2];
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const resolveInteractCandidate = (
	input: ResolveInput,
): InteractCandidate | null => {
	const { currentRoomId, hasTreasureKey, enemiesRemaining, nearInteractable } =
		input;

	if (
		currentRoomId === ROOM_IDS.GUARD_ROOM &&
		!hasTreasureKey &&
		nearInteractable === DUNGEON_INTERACTABLE_IDS.TREASURE_KEY
	) {
		return {
			type: INTERACTION_CANDIDATE_TYPES.KEY,
			event: DUNGEON_EVENTS.PICK_UP_KEY,
			interactableId: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
			prompt: INTERACTION_PROMPTS[DUNGEON_EVENTS.PICK_UP_KEY],
		};
	}

	const roomDoors = DOORWAY_INTERACTIONS_BY_ROOM[currentRoomId];
	if (!roomDoors) return null;

	for (const [doorSide, doorConfig] of Object.entries(roomDoors)) {
		const doorKey = `${currentRoomId}:${doorSide}` as DungeonInteractableId;

		if (nearInteractable !== doorKey) {
			continue;
		}

		const isDoorGuardOpen =
			doorConfig.guard === DOOR_GUARDS.NONE
				? true
				: doorConfig.guard === DOOR_GUARDS.TREASURY
					? hasTreasureKey && enemiesRemaining === 0
					: hasTreasureKey;
		const actionEvent = isDoorGuardOpen
			? doorConfig.successEvent
			: (doorConfig.lockedEvent ?? doorConfig.successEvent);
		const isExitDoor = doorConfig.guard === DOOR_GUARDS.EXIT;
		const candidateType = isExitDoor
			? INTERACTION_CANDIDATE_TYPES.EXIT
			: doorConfig.guard === DOOR_GUARDS.NONE
				? INTERACTION_CANDIDATE_TYPES.DOOR
				: INTERACTION_CANDIDATE_TYPES.GUARDED_DOOR;

		return {
			type: candidateType,
			event: actionEvent,
			interactableId: doorKey,
			prompt:
				INTERACTION_PROMPTS[actionEvent as keyof typeof INTERACTION_PROMPTS],
		};
	}

	return null;
};

const resolveAttackCandidate = (
	input: ResolveInput,
): AttackCandidate | null => {
	const { currentRoomId, enemiesRemaining, playerPosition, enemyPositions } =
		input;

	if (enemiesRemaining <= 0 || currentRoomId !== ROOM_IDS.GUARD_ROOM) {
		return null;
	}

	let nearest: AttackCandidate | null = null;

	for (const pos of enemyPositions) {
		const dist = distance(playerPosition, pos);
		if (dist <= ENEMY_CONFIG.ATTACK_RADIUS) {
			if (!nearest || dist < nearest.distance) {
				nearest = {
					type: INTERACTION_CANDIDATE_TYPES.ENEMY,
					distance: dist,
					position: pos,
				};
			}
		}
	}

	return nearest;
};

export const resolveInteractionCandidates = (
	input: ResolveInput,
): InteractionCandidates => {
	return {
		interact: resolveInteractCandidate(input),
		attack: resolveAttackCandidate(input),
	};
};

export type {
	AttackCandidate,
	InteractCandidate,
	InteractionCandidates,
	ResolveInput,
};
