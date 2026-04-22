import {
	CORRIDOR_ENTITY_CONFIG,
	type CorridorMeshSettings,
} from "@/entities/corridor";
import { ROOM_LABELS, type RoomId } from "@/entities/dungeon";
import {
	ENEMY_SPAWN_HEIGHT_OFFSET,
	ENEMY_SPAWN_OFFSET_XZ,
	type EnemyMeshSettings,
} from "@/entities/enemy";
import {
	type DungeonCorridorLayout,
	type DungeonRoomLayout,
	getRoomLabelPosition,
	ROOM_ENTITY_CONFIG,
	type RoomLabelSettings,
	type RoomWallOpening,
} from "@/entities/room";
import type { Vector3Tuple } from "@/shared/lib";

type SceneRoomMeshSettings = {
	roomId: string;
	position: Vector3Tuple;
	labelSettings: RoomLabelSettings;
	wallOpenings: RoomWallOpening[];
	lockedDoorSides: RoomWallOpening[];
	openedDoorSides: RoomWallOpening[];
	isTreasury: boolean;
	showTreasureKey: boolean;
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

const computeWallOpenings = (
	roomId: string,
	roomPosition: Vector3Tuple,
	corridors: readonly DungeonCorridorLayout[],
): RoomWallOpening[] => {
	const openings: RoomWallOpening[] = [];

	for (const corridor of corridors) {
		if (corridor.sourceRoomId !== roomId && corridor.targetRoomId !== roomId) {
			continue;
		}

		const dx = corridor.position[0] - roomPosition[0];
		const dz = corridor.position[2] - roomPosition[2];

		if (Math.abs(dz) > Math.abs(dx)) {
			if (dz > 0) {
				openings.push("south");
			} else {
				openings.push("north");
			}
		} else {
			if (dx > 0) {
				openings.push("east");
			} else {
				openings.push("west");
			}
		}
	}

	return [...new Set(openings)];
};

export const createSceneRoomMeshSettings = (
	rooms: readonly DungeonRoomLayout[],
	corridors: readonly DungeonCorridorLayout[] = [],
	lockedDoorSidesByRoomId: Partial<
		Record<string, readonly RoomWallOpening[]>
	> = {},
): SceneRoomMeshSettings[] => {
	return rooms.map((room) => ({
		roomId: room.roomId,
		position: room.position,
		labelSettings: createSceneRoomLabelSettings(room.roomId, room.position),
		wallOpenings: computeWallOpenings(room.roomId, room.position, corridors),
		lockedDoorSides: [...(lockedDoorSidesByRoomId[room.roomId] ?? [])],
		openedDoorSides: [],
		isTreasury: false,
		showTreasureKey: false,
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

export const createSceneEnemyMeshSettings = (
	rooms: readonly DungeonRoomLayout[],
	guardRoomId: string,
	enemyCount: number,
): EnemyMeshSettings[] => {
	const guardRoom = rooms.find((room) => room.roomId === guardRoomId);

	if (!guardRoom) {
		return [];
	}

	const [rx, ry, rz] = guardRoom.position;
	const centerY = ry + ENEMY_SPAWN_HEIGHT_OFFSET;
	const spawnOffset = ENEMY_SPAWN_OFFSET_XZ / 2;
	const enemySettings: EnemyMeshSettings[] = [
		{
			id: `${guardRoomId}-enemy-1`,
			roomId: guardRoomId,
			position: [rx, centerY, rz] as [number, number, number],
			patrolCenter: [rx, centerY, rz] as [number, number, number],
		},
		{
			id: `${guardRoomId}-enemy-2`,
			roomId: guardRoomId,
			position: [rx + spawnOffset, centerY, rz - spawnOffset] as [
				number,
				number,
				number,
			],
			patrolCenter: [rx, centerY, rz] as [number, number, number],
		},
	];

	return enemySettings.slice(0, Math.max(0, enemyCount));
};

export type { EnemyMeshSettings, SceneRoomMeshSettings };
