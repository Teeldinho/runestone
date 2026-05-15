import { describe, expect, it } from "vitest";

import {
	createFloorOneMachine,
	DUNGEON_RUNE_STATES,
	DUNGEON_THEME,
	ROOM_IDS,
} from "@/entities/dungeon";
import { PLAYER_ENTITY_CONFIG } from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import { CAMERA_MODES } from "@/features/camera-system";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

import {
	CANVAS_FOG_DENSITY_MULTIPLIERS_BY_ROOM,
	CANVAS_FREE_ORBITAL_TORCH_ROOM_LIMIT,
	CANVAS_RUNE_EMISSIVE_MULTIPLIERS,
} from "../config";

import {
	type CanvasMachineRuntimeInput,
	createCanvasMachineSettingsViewModel,
} from "./createCanvasMachineSettingsViewModel";
import { createCanvasSettingsViewModel } from "./createCanvasSettingsViewModel";

const createMachineRuntime = (
	overrides?: Partial<CanvasMachineRuntimeInput>,
): CanvasMachineRuntimeInput => ({
	currentRoomId: ROOM_IDS.ENTRANCE,
	hasTreasureKey: false,
	enemiesRemaining: 1,
	...overrides,
});

describe("createCanvasMachineSettingsViewModel", () => {
	it("applies rune/fog runtime modifiers from machine state", () => {
		const floorRooms = createDungeonFloorLayout(createFloorOneMachine()).rooms;
		const settings = createCanvasMachineSettingsViewModel({
			baseCanvasSettings: createCanvasSettingsViewModel(),
			floorRooms,
			machineRuntime: createMachineRuntime({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: false,
				enemiesRemaining: 1,
			}),
			playerSpawnHeightOffset:
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
		});

		expect(settings.environment.rune.activeColor).toBe(
			DUNGEON_THEME.RUNES.SEALED,
		);
		expect(settings.environment.rune.openColor).toBe(
			DUNGEON_THEME.RUNES.SEALED,
		);
		expect(settings.environment.rune.emissiveIntensity).toBeCloseTo(
			GAME_CANVAS_CONFIG.SCENE.RUNE_EMISSIVE_INTENSITY *
				CANVAS_RUNE_EMISSIVE_MULTIPLIERS[DUNGEON_RUNE_STATES.SEALED],
		);
		expect(settings.fog.density).toBeCloseTo(
			DUNGEON_THEME.FOG.DENSITY *
				CANVAS_FOG_DENSITY_MULTIPLIERS_BY_ROOM[ROOM_IDS.GUARD_ROOM],
		);
	});

	it("limits free-orbital torch positions to nearest-room budget", () => {
		const floorRooms = createDungeonFloorLayout(createFloorOneMachine()).rooms;
		const settings = createCanvasMachineSettingsViewModel({
			baseCanvasSettings: createCanvasSettingsViewModel(),
			cameraStateSnapshot: {
				fov: 58,
				mode: CAMERA_MODES.FREE_ORBITAL,
				position: [0, 16, -18],
				target: [0, 0, 0],
				zoom: 1,
				yaw: 0,
				pitch: 0,
				distance: 6,
			},
			floorRooms,
			machineRuntime: createMachineRuntime(),
			playerSpawnHeightOffset:
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
		});

		expect(settings.lighting.torch.positions).toHaveLength(
			CANVAS_FREE_ORBITAL_TORCH_ROOM_LIMIT *
				GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS.length,
		);
	});
});
