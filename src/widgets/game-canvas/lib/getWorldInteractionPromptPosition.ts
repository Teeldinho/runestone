import {
	type DoorStateKey,
	DUNGEON_INTERACTABLE_IDS,
	type DungeonInteractableId,
	parseDoorKey,
	ROOM_IDS,
} from "@/entities/dungeon";
import type { Vector3Tuple } from "@/shared/types";

import { WORLD_INTERACTION_PROMPT_CONFIG } from "../config";
import { getDoorwayAnchorPosition } from "./getDoorwayAnchorPosition";
import type { SceneRoomMeshSettings } from "./sceneEnvironmentMappers";

export const getWorldInteractionPromptPosition = (
	interactableId: DungeonInteractableId | null,
	roomMeshSettings: readonly SceneRoomMeshSettings[],
): Vector3Tuple | null => {
	if (!interactableId) {
		return null;
	}

	if (interactableId === DUNGEON_INTERACTABLE_IDS.TREASURE_KEY) {
		const guardRoom = roomMeshSettings.find(
			(room) => room.roomId === ROOM_IDS.GUARD_ROOM,
		);

		if (!guardRoom) {
			return null;
		}

		return [
			guardRoom.position[0],
			guardRoom.position[1] + WORLD_INTERACTION_PROMPT_CONFIG.KEY_HEIGHT,
			guardRoom.position[2],
		];
	}

	const { doorSide, roomId } = parseDoorKey(interactableId as DoorStateKey);
	const room = roomMeshSettings.find(
		(roomMeshSetting) => roomMeshSetting.roomId === roomId,
	);

	if (!room) {
		return null;
	}

	return getDoorwayAnchorPosition(
		room.position,
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
