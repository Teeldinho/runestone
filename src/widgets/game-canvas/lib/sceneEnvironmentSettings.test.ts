import { describe, expect, it } from "vitest";

import {
	createFloorOneMachine,
	DOOR_SIDES,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";
import {
	createPlayerMeshSettings,
	PLAYER_ENTITY_CONFIG,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";

import { createSceneEnvironmentSettingsViewModel } from "./sceneEnvironmentSettings";

describe("createSceneEnvironmentSettingsViewModel", () => {
	it("assembles room, corridor, enemy, and player settings from the floor layout and runtime state", () => {
		const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
		const defaultPlayerMeshSettings = createPlayerMeshSettings({
			origin: PLAYER_ENTITY_CONFIG.ORIGIN,
		});

		const viewModel = createSceneEnvironmentSettingsViewModel({
			defaultPlayerMeshSettings,
			enemiesRemaining: 1,
			floorLayout,
			hasTreasureKey: false,
		});

		expect(viewModel.corridorMeshSettings).toHaveLength(4);
		expect(viewModel.corridorMeshSettings[0]).toMatchObject({
			id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.LIBRARY}`,
			position: [0, -0.12, -30],
		});

		expect(viewModel.roomMeshSettings).toHaveLength(5);
		expect(
			viewModel.roomMeshSettings.find(
				(room) => room.roomId === ROOM_IDS.GUARD_ROOM,
			),
		).toMatchObject({
			isTreasury: false,
			lockedDoorSides: [DOOR_SIDES.SOUTH],
			showTreasureKey: true,
		});
		expect(
			viewModel.roomMeshSettings.find(
				(room) => room.roomId === ROOM_IDS.TREASURY,
			),
		).toMatchObject({
			isTreasury: true,
			lockedDoorSides: [DOOR_SIDES.SOUTH],
			showTreasureKey: false,
		});

		expect(viewModel.enemyMeshSettings).toHaveLength(1);
		expect(viewModel.playerMeshSettings.position).toEqual([
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			-40,
		]);
	});

	it("unlocks the guard room and treasury after key pickup and enemy clear", () => {
		const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
		const defaultPlayerMeshSettings = createPlayerMeshSettings({
			origin: PLAYER_ENTITY_CONFIG.ORIGIN,
		});

		const viewModel = createSceneEnvironmentSettingsViewModel({
			defaultPlayerMeshSettings,
			enemiesRemaining: FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
			floorLayout,
			hasTreasureKey: true,
		});

		expect(
			viewModel.roomMeshSettings.find(
				(room) => room.roomId === ROOM_IDS.GUARD_ROOM,
			),
		).toMatchObject({
			lockedDoorSides: [],
			showTreasureKey: false,
		});
		expect(
			viewModel.roomMeshSettings.find(
				(room) => room.roomId === ROOM_IDS.TREASURY,
			),
		).toMatchObject({
			lockedDoorSides: [],
		});
		expect(viewModel.enemyMeshSettings).toHaveLength(0);
	});

	it("falls back to the default player position when the floor has no initial room", () => {
		const defaultPlayerMeshSettings = createPlayerMeshSettings({
			origin: PLAYER_ENTITY_CONFIG.ORIGIN,
		});

		const viewModel = createSceneEnvironmentSettingsViewModel({
			defaultPlayerMeshSettings,
			enemiesRemaining: 0,
			floorLayout: {
				corridors: [],
				rooms: [],
				transitions: [],
			},
			hasTreasureKey: false,
		});

		expect(viewModel.playerMeshSettings.position).toEqual(
			defaultPlayerMeshSettings.position,
		);
		expect(viewModel.corridorMeshSettings).toHaveLength(0);
		expect(viewModel.roomMeshSettings).toHaveLength(0);
		expect(viewModel.enemyMeshSettings).toHaveLength(0);
	});
});
