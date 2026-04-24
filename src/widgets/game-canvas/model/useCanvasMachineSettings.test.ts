// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
	DUNGEON_RUNE_STATES,
	DUNGEON_THEME,
	ROOM_IDS,
} from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

import {
	CANVAS_FOG_DENSITY_MULTIPLIERS_BY_ROOM,
	CANVAS_FREE_ORBITAL_TORCH_ROOM_LIMIT,
	CANVAS_RUNE_EMISSIVE_MULTIPLIERS,
	CANVAS_TORCH_INTENSITY_CONFIG,
} from "../config";
import {
	type CanvasMachineRuntime,
	useCanvasMachineSettings,
} from "./useCanvasMachineSettings";

const RUNE_COLORS_BY_STATE = {
	[DUNGEON_RUNE_STATES.SEALED]: DUNGEON_THEME.RUNES.SEALED,
	[DUNGEON_RUNE_STATES.OPEN]: DUNGEON_THEME.RUNES.OPEN,
	[DUNGEON_RUNE_STATES.ACTIVE]: DUNGEON_THEME.RUNES.ACTIVE,
} as const;

const createMachineRuntime = (
	overrides?: Partial<CanvasMachineRuntime>,
): CanvasMachineRuntime => ({
	currentRoomId: ROOM_IDS.ENTRANCE,
	hasTreasureKey: false,
	enemiesRemaining: 1,
	...overrides,
});

describe("useCanvasMachineSettings", () => {
	it("keeps runes sealed while key is missing", () => {
		const machineRuntime = createMachineRuntime({
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			hasTreasureKey: false,
			enemiesRemaining: 1,
		});

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime),
		);

		expect(result.current.environment.rune.activeColor).toBe(
			RUNE_COLORS_BY_STATE[DUNGEON_RUNE_STATES.SEALED],
		);
		expect(result.current.environment.rune.openColor).toBe(
			RUNE_COLORS_BY_STATE[DUNGEON_RUNE_STATES.SEALED],
		);
		expect(result.current.environment.rune.emissiveIntensity).toBeCloseTo(
			GAME_CANVAS_CONFIG.SCENE.RUNE_EMISSIVE_INTENSITY *
				CANVAS_RUNE_EMISSIVE_MULTIPLIERS[DUNGEON_RUNE_STATES.SEALED],
		);
		expect(result.current.fog.density).toBeCloseTo(
			DUNGEON_THEME.FOG.DENSITY *
				CANVAS_FOG_DENSITY_MULTIPLIERS_BY_ROOM[ROOM_IDS.GUARD_ROOM],
		);
		expect(result.current.lighting.torch.intensity).toBeCloseTo(
			DUNGEON_THEME.LIGHTING.TORCH_INTENSITY +
				1 * CANVAS_TORCH_INTENSITY_CONFIG.ENEMY_STEP,
		);
		expect(result.current.lighting.torch.positions).toHaveLength(
			GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS.length,
		);
	});

	it("limits top-down torch lights to the current room", () => {
		const machineRuntime = createMachineRuntime();

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime, {
				fov: 60,
				mode: CAMERA_MODES.TOP_DOWN,
				position: [0, 20, 0],
				target: [0, 0, 0],
				zoom: 1,
			}),
		);

		expect(result.current.lighting.torch.positions).toHaveLength(
			GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS.length,
		);
	});

	it("renders nearest-room torch lights in free-orbital mode for performance", () => {
		const machineRuntime = createMachineRuntime();

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime, {
				fov: 58,
				mode: CAMERA_MODES.FREE_ORBITAL,
				position: [0, 16, -18],
				target: [0, 0, 0],
				zoom: 1,
			}),
		);

		expect(result.current.lighting.torch.positions).toHaveLength(
			CANVAS_FREE_ORBITAL_TORCH_ROOM_LIMIT *
				GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS.length,
		);
	});

	it("limits torch lights to the current room in third-person mode for performance", () => {
		const machineRuntime = createMachineRuntime({
			currentRoomId: ROOM_IDS.GUARD_ROOM,
		});

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime, {
				fov: 65,
				mode: CAMERA_MODES.THIRD_PERSON,
				position: [0, 2.2, -3.8],
				target: [0, 0, 0],
				zoom: 1,
			}),
		);

		expect(result.current.lighting.torch.positions).toHaveLength(
			GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS.length,
		);
	});

	it("opens runes once the key is collected", () => {
		const machineRuntime = createMachineRuntime({
			currentRoomId: ROOM_IDS.TREASURY,
			hasTreasureKey: true,
			enemiesRemaining: 2,
		});

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime),
		);

		expect(result.current.environment.rune.activeColor).toBe(
			RUNE_COLORS_BY_STATE[DUNGEON_RUNE_STATES.OPEN],
		);
		expect(result.current.environment.rune.openColor).toBe(
			RUNE_COLORS_BY_STATE[DUNGEON_RUNE_STATES.OPEN],
		);
		expect(result.current.environment.rune.emissiveIntensity).toBeCloseTo(
			GAME_CANVAS_CONFIG.SCENE.RUNE_EMISSIVE_INTENSITY *
				CANVAS_RUNE_EMISSIVE_MULTIPLIERS[DUNGEON_RUNE_STATES.OPEN],
		);
	});

	it("activates runes when key is collected and enemies are cleared", () => {
		const machineRuntime = createMachineRuntime({
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			hasTreasureKey: true,
			enemiesRemaining: 0,
		});

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime),
		);

		expect(result.current.environment.rune.activeColor).toBe(
			RUNE_COLORS_BY_STATE[DUNGEON_RUNE_STATES.ACTIVE],
		);
		expect(result.current.environment.rune.openColor).toBe(
			RUNE_COLORS_BY_STATE[DUNGEON_RUNE_STATES.ACTIVE],
		);
		expect(result.current.environment.rune.emissiveIntensity).toBeCloseTo(
			GAME_CANVAS_CONFIG.SCENE.RUNE_EMISSIVE_INTENSITY *
				CANVAS_RUNE_EMISSIVE_MULTIPLIERS[DUNGEON_RUNE_STATES.ACTIVE],
		);
		expect(result.current.lighting.torch.intensity).toBe(
			DUNGEON_THEME.LIGHTING.TORCH_INTENSITY,
		);
	});

	it("overrides canvas camera from camera-system snapshot", () => {
		const machineRuntime = createMachineRuntime();

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime, {
				fov: 90,
				mode: CAMERA_MODES.THIRD_PERSON,
				position: [1, 2, 3],
				target: [0, 0, 0],
				zoom: 1.25,
			}),
		);

		expect(result.current.camera.fov).toBe(90);
		expect(result.current.camera.position).toEqual([1, 2, 3]);
		expect(result.current.camera.zoom).toBe(1.25);
	});

	it("derives playerSpawnPosition from the current room", () => {
		const machineRuntime = createMachineRuntime({
			currentRoomId: ROOM_IDS.GUARD_ROOM,
		});

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime),
		);

		expect(result.current.playerSpawnPosition).toEqual([0, 0.9, 0]);
	});

	it("returns isPostprocessingEnabled as false when postprocessingEnabled prop is false", () => {
		const machineRuntime = createMachineRuntime();

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime, undefined, false),
		);

		expect(result.current.isPostprocessingEnabled).toBe(false);
	});

	it("returns isPostprocessingEnabled as true when postprocessingEnabled prop is true even if base canvas defaults to false", () => {
		const machineRuntime = createMachineRuntime();

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime, undefined, true),
		);

		expect(result.current.isPostprocessingEnabled).toBe(true);
	});
});
