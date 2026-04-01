import {
	type DoorStateKey,
	DUNGEON_EVENTS,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";
import { ENEMY_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import { DOORWAY_INTERACTIONS_BY_ROOM } from "../config";

type InteractType = "key" | "guarded-door" | "door" | "exit";

type InteractCandidate = {
	type: InteractType;
	event: (typeof DUNGEON_EVENTS)[keyof typeof DUNGEON_EVENTS];
	doorKey?: DoorStateKey;
};

type AttackCandidate = {
	type: "enemy";
	distance: number;
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
	openedDoors: DoorStateKey[];
	nearInteractable: DoorStateKey | null;
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
	const { currentRoomId, hasTreasureKey, openedDoors, nearInteractable } =
		input;

	if (currentRoomId === ROOM_IDS.GUARD_ROOM && !hasTreasureKey) {
		return {
			type: "key",
			event: DUNGEON_EVENTS.PICK_UP_KEY,
		};
	}

	const roomDoors = DOORWAY_INTERACTIONS_BY_ROOM[currentRoomId];
	if (!roomDoors) return null;

	for (const [doorSide, doorConfig] of Object.entries(roomDoors)) {
		const doorKey = `${currentRoomId}:${doorSide}` as DoorStateKey;

		if (nearInteractable !== doorKey) {
			continue;
		}

		const isDoorOpen = openedDoors.includes(doorKey);
		const isGuarded = doorConfig.guard !== "none";

		if (!isGuarded || isDoorOpen) {
			return {
				type: isGuarded ? "guarded-door" : "door",
				event: doorConfig.successEvent,
				doorKey,
			};
		}
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
				nearest = { type: "enemy", distance: dist };
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
