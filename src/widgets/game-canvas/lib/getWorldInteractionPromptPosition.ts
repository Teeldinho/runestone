import {
	type DoorStateKey,
	DUNGEON_INTERACTABLE_IDS,
	type DungeonInteractableId,
	parseDoorKey,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";
import type { Vector3Tuple } from "@/shared/types";

import { WORLD_INTERACTION_PROMPT_CONFIG } from "../config";
import { getDoorwayAnchorPosition } from "./getDoorwayAnchorPosition";

type RoomPositionsById = Partial<Record<RoomId, Vector3Tuple>>;

export const getWorldInteractionPromptPosition = (
	interactableId: DungeonInteractableId | null,
	roomPositionsById: RoomPositionsById,
): Vector3Tuple | null => {
	if (!interactableId) {
		return null;
	}

	if (interactableId === DUNGEON_INTERACTABLE_IDS.TREASURE_KEY) {
		const guardRoomPosition = roomPositionsById[ROOM_IDS.GUARD_ROOM];

		if (!guardRoomPosition) {
			return null;
		}

		return [
			guardRoomPosition[0],
			guardRoomPosition[1] + WORLD_INTERACTION_PROMPT_CONFIG.KEY_HEIGHT,
			guardRoomPosition[2],
		];
	}

	const { doorSide, roomId } = parseDoorKey(interactableId as DoorStateKey);
	const roomPosition = roomPositionsById[roomId as RoomId];

	if (!roomPosition) {
		return null;
	}

	return getDoorwayAnchorPosition(
		roomPosition,
		doorSide,
		WORLD_INTERACTION_PROMPT_CONFIG.DOOR_HEIGHT,
	);
};

export const getWorldAttackPromptPosition = (
	enemyPosition: Vector3Tuple | null,
): Vector3Tuple | null => {
	if (!enemyPosition) {
		return null;
	}

	return [
		enemyPosition[0],
		enemyPosition[1] + WORLD_INTERACTION_PROMPT_CONFIG.ENEMY_HEIGHT_OFFSET,
		enemyPosition[2],
	];
};

export type { RoomPositionsById };
