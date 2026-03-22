import { describe, expect, it } from "vitest";

import { ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import type { DungeonCorridorLayout, DungeonRoomLayout } from "@/entities/room";
import { ROOM_ENTITY_CONFIG } from "@/entities/room";

import {
	createSceneCorridorMeshSettings,
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
		expect(createSceneRoomMeshSettings(ROOM_LAYOUT_FIXTURE)).toEqual([
			{
				roomId: ROOM_IDS.ENTRANCE,
				position: [0, 0, -40],
				labelSettings: {
					isVisible: true,
					position: [0, ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET, -40],
					text: ROOM_LABELS[ROOM_IDS.ENTRANCE],
				},
			},
			{
				roomId: ROOM_IDS.LIBRARY,
				position: [0, 0, -20],
				labelSettings: {
					isVisible: true,
					position: [0, ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET, -20],
					text: ROOM_LABELS[ROOM_IDS.LIBRARY],
				},
			},
		]);
	});

	it("maps generated dungeon corridors into scene corridor settings", () => {
		expect(createSceneCorridorMeshSettings(CORRIDOR_LAYOUT_FIXTURE)).toEqual([
			{
				id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.LIBRARY}`,
				position: [0, -0.1, -30],
				rotationYRad: 0,
			},
		]);
	});

	it("selects initial-room spawn point and keeps player Y offset", () => {
		expect(
			createSceneSpawnPosition(ROOM_LAYOUT_FIXTURE, [12, 0.45, 18]),
		).toEqual([0, 0.45, -40]);
	});
});
