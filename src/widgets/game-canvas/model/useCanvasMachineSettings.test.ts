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
	type CanvasMachineRuntime,
	useCanvasMachineSettings,
} from "./useCanvasMachineSettings";

const FOG_MULTIPLIER_GUARD_ROOM = 1.2;
const RUNE_EMISSIVE_MULTIPLIER_SEALED = 0.3;
const RUNE_EMISSIVE_MULTIPLIER_OPEN = 0.75;
const RUNE_EMISSIVE_MULTIPLIER_ACTIVE = 1.2;
const TORCH_INTENSITY_ENEMY_STEP = 0.3;

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
				RUNE_EMISSIVE_MULTIPLIER_SEALED,
		);
		expect(result.current.fog.density).toBeCloseTo(
			DUNGEON_THEME.FOG.DENSITY * FOG_MULTIPLIER_GUARD_ROOM,
		);
		expect(result.current.lighting.torch.intensity).toBeCloseTo(
			DUNGEON_THEME.LIGHTING.TORCH_INTENSITY + TORCH_INTENSITY_ENEMY_STEP,
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
				RUNE_EMISSIVE_MULTIPLIER_OPEN,
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
				RUNE_EMISSIVE_MULTIPLIER_ACTIVE,
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

	it("returns isPostprocessingEnabled as false when postprocessingEnabled prop is false", () => {
		const machineRuntime = createMachineRuntime();

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime, undefined, false),
		);

		expect(result.current.isPostprocessingEnabled).toBe(false);
	});

	it("returns isPostprocessingEnabled as true when postprocessingEnabled prop is true and postprocessing.enabled is true", () => {
		const machineRuntime = createMachineRuntime();

		const { result } = renderHook(() =>
			useCanvasMachineSettings(machineRuntime, undefined, true),
		);

		// Since postprocessing.enabled defaults to true in useCanvasSettings
		expect(result.current.isPostprocessingEnabled).toBe(true);
	});
});
