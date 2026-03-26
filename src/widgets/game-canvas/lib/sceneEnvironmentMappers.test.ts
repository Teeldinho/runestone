import { describe, expect, it } from "vitest";

import { CORRIDOR_ENTITY_CONFIG } from "@/entities/corridor";
import { ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import {
	ENEMY_SPAWN_HEIGHT_OFFSET,
	ENEMY_SPAWN_OFFSET_XZ,
} from "@/entities/enemy";
import type { DungeonCorridorLayout, DungeonRoomLayout } from "@/entities/room";
import { ROOM_ENTITY_CONFIG } from "@/entities/room";

import {
	createSceneCorridorMeshSettings,
	createSceneEnemyMeshSettings,
	createSceneRoomMeshSettings,
	createSceneSpawnPosition,
} from "./sceneEnvironmentMappers";

const ROOM_LAYOUT_FIXTURE: DungeonRoomLayout[] = [
	{
		roomId: ROOM_IDS.ENTRANCE,
		label: ROOM_LABELS[ROOM_IDS.ENTRANCE],
		position: [0, 0, -40],
		isFinal: false,
		isInitial: true,
	},
	{
		roomId: ROOM_IDS.LIBRARY,
		label: ROOM_LABELS[ROOM_IDS.LIBRARY],
		position: [0, 0, -20],
		isFinal: false,
		isInitial: false,
	},
] as const;

const GUARD_ROOM_FIXTURE: DungeonRoomLayout[] = [
	{
		roomId: ROOM_IDS.GUARD_ROOM,
		label: ROOM_LABELS[ROOM_IDS.GUARD_ROOM],
		position: [0, 0, 0],
		isFinal: false,
		isInitial: false,
	},
] as const;

const CORRIDOR_LAYOUT_FIXTURE: DungeonCorridorLayout[] = [
	{
		id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.LIBRARY}`,
		sourceRoomId: ROOM_IDS.ENTRANCE,
		targetRoomId: ROOM_IDS.LIBRARY,
		position: [0, 0, -30],
		rotationYRad: 0,
	},
] as const;

describe("sceneEnvironmentMappers", () => {
	it("maps dungeon rooms into scene room mesh settings", () => {
		expect(
			createSceneRoomMeshSettings(ROOM_LAYOUT_FIXTURE, CORRIDOR_LAYOUT_FIXTURE),
		).toEqual([
			{
				roomId: ROOM_IDS.ENTRANCE,
				position: [0, 0, -40],
				lockedDoorSides: [],
				labelSettings: {
					isVisible: true,
					position: [0, ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET, -40],
					text: ROOM_LABELS[ROOM_IDS.ENTRANCE],
				},
				wallOpenings: ["south"],
			},
			{
				roomId: ROOM_IDS.LIBRARY,
				position: [0, 0, -20],
				lockedDoorSides: [],
				labelSettings: {
					isVisible: true,
					position: [0, ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET, -20],
					text: ROOM_LABELS[ROOM_IDS.LIBRARY],
				},
				wallOpenings: ["north"],
			},
		]);
	});

	it("injects locked doorway sides per room", () => {
		expect(
			createSceneRoomMeshSettings(
				ROOM_LAYOUT_FIXTURE,
				CORRIDOR_LAYOUT_FIXTURE,
				{
					[ROOM_IDS.ENTRANCE]: ["south"],
				},
			),
		).toMatchObject([
			{
				roomId: ROOM_IDS.ENTRANCE,
				lockedDoorSides: ["south"],
			},
			{
				roomId: ROOM_IDS.LIBRARY,
				lockedDoorSides: [],
			},
		]);
	});

	it("maps generated dungeon corridors into scene corridor settings", () => {
		expect(createSceneCorridorMeshSettings(CORRIDOR_LAYOUT_FIXTURE)).toEqual([
			{
				id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.LIBRARY}`,
				position: [0, CORRIDOR_ENTITY_CONFIG.SURFACE.Y_OFFSET, -30],
				rotationYRad: 0,
			},
		]);
	});

	it("selects initial-room spawn point and keeps player Y offset", () => {
		expect(
			createSceneSpawnPosition(ROOM_LAYOUT_FIXTURE, [12, 0.45, 18]),
		).toEqual([0, 0.45, -40]);
	});

	it("returns empty array when guard room is not found", () => {
		expect(
			createSceneEnemyMeshSettings(ROOM_LAYOUT_FIXTURE, ROOM_IDS.GUARD_ROOM),
		).toEqual([]);
	});

	it("spawns 2 enemies at offset positions in the guard room", () => {
		const enemies = createSceneEnemyMeshSettings(
			GUARD_ROOM_FIXTURE,
			ROOM_IDS.GUARD_ROOM,
		);

		expect(enemies).toHaveLength(2);
		expect(enemies[0].id).toBe(`${ROOM_IDS.GUARD_ROOM}-enemy-1`);
		expect(enemies[1].id).toBe(`${ROOM_IDS.GUARD_ROOM}-enemy-2`);
		expect(enemies[0].roomId).toBe(ROOM_IDS.GUARD_ROOM);
		expect(enemies[1].roomId).toBe(ROOM_IDS.GUARD_ROOM);
		expect(enemies[0].position[0]).toBe(-ENEMY_SPAWN_OFFSET_XZ);
		expect(enemies[0].position[1]).toBe(ENEMY_SPAWN_HEIGHT_OFFSET);
		expect(enemies[0].position[2]).toBe(ENEMY_SPAWN_OFFSET_XZ);
		expect(enemies[1].position[0]).toBe(ENEMY_SPAWN_OFFSET_XZ);
		expect(enemies[1].position[1]).toBe(ENEMY_SPAWN_HEIGHT_OFFSET);
		expect(enemies[1].position[2]).toBe(-ENEMY_SPAWN_OFFSET_XZ);
	});
});
