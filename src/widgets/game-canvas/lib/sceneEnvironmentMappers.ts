import {
	CORRIDOR_ENTITY_CONFIG,
	type CorridorMeshSettings,
} from "@/entities/corridor";
import { ROOM_LABELS, type RoomId } from "@/entities/dungeon";
import {
	type DungeonCorridorLayout,
	type DungeonRoomLayout,
	getRoomLabelPosition,
	ROOM_ENTITY_CONFIG,
	type RoomLabelSettings,
} from "@/entities/room";
import type { Vector3Tuple } from "@/shared/types";

type SceneRoomMeshSettings = {
	roomId: string;
	position: Vector3Tuple;
	labelSettings: RoomLabelSettings;
};

const createSceneRoomLabelSettings = (
	roomId: string,
	position: Vector3Tuple,
): RoomLabelSettings => {
	return {
		isVisible: true,
		position: getRoomLabelPosition({
			center: position,
			heightOffset: ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET,
		}),
		text: ROOM_LABELS[roomId as RoomId] ?? roomId,
	};
};

const withYOffset = (position: Vector3Tuple, yOffset: number): Vector3Tuple => {
	return [position[0], position[1] + yOffset, position[2]];
};

export const createSceneRoomMeshSettings = (
	rooms: readonly DungeonRoomLayout[],
): SceneRoomMeshSettings[] => {
	return rooms.map((room) => ({
		roomId: room.roomId,
		position: room.position,
		labelSettings: createSceneRoomLabelSettings(room.roomId, room.position),
	}));
};

export const createSceneCorridorMeshSettings = (
	corridors: readonly DungeonCorridorLayout[],
): CorridorMeshSettings[] => {
	return corridors.map((corridor) => ({
		id: corridor.id,
		position: withYOffset(
			corridor.position,
			CORRIDOR_ENTITY_CONFIG.SURFACE.Y_OFFSET,
		),
		rotationYRad: corridor.rotationYRad,
	}));
};

export const createSceneSpawnPosition = (
	rooms: readonly DungeonRoomLayout[],
	defaultPlayerPosition: Vector3Tuple,
): Vector3Tuple => {
	const initialRoom = rooms.find((room) => room.isInitial);

	if (!initialRoom) {
		return defaultPlayerPosition;
	}

	return [
		initialRoom.position[0],
		defaultPlayerPosition[1],
		initialRoom.position[2],
	];
};

export type { SceneRoomMeshSettings };
