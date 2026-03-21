// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DUNGEON_THEME } from "@/entities/dungeon";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

import { useCanvasSettings } from "./useCanvasSettings";

describe("useCanvasSettings", () => {
	it("returns grouped fog and lighting values from dungeon theme constants", () => {
		const { result } = renderHook(() => useCanvasSettings());

		expect(result.current.fog.color).toBe(DUNGEON_THEME.FOG.COLOR);
		expect(result.current.fog.density).toBe(DUNGEON_THEME.FOG.DENSITY);
		expect(result.current.lighting.torch.color).toBe(
			DUNGEON_THEME.LIGHTING.TORCH_COLOR,
		);
		expect(result.current.lighting.torch.intensity).toBe(
			DUNGEON_THEME.LIGHTING.TORCH_INTENSITY,
		);
		expect(result.current.lighting.ambient.intensity).toBe(
			DUNGEON_THEME.LIGHTING.AMBIENT_INTENSITY,
		);
	});

	it("returns grouped camera and renderer values from canvas config constants", () => {
		const { result } = renderHook(() => useCanvasSettings());

		expect(result.current.camera.fov).toBe(GAME_CANVAS_CONFIG.CAMERA.FOV);
		expect(result.current.camera.position).toEqual(
			GAME_CANVAS_CONFIG.CAMERA.POSITION,
		);
		expect(result.current.renderer.dprRange).toEqual(
			GAME_CANVAS_CONFIG.RENDERER.DPR_RANGE,
		);
		expect(result.current.renderer.shadowsEnabled).toBe(
			GAME_CANVAS_CONFIG.RENDERER.SHADOWS_ENABLED,
		);
	});

	it("returns grouped environment values from scene config constants", () => {
		const { result } = renderHook(() => useCanvasSettings());

		expect(result.current.environment.floor.size).toEqual(
			GAME_CANVAS_CONFIG.SCENE.FLOOR_SIZE,
		);
		expect(result.current.environment.pillar.height).toBe(
			GAME_CANVAS_CONFIG.SCENE.PILLAR_HEIGHT,
		);
		expect(result.current.environment.rune.activeColor).toBe(
			DUNGEON_THEME.RUNES.ACTIVE,
		);
		expect(result.current.environment.grid.divisions).toBe(
			GAME_CANVAS_CONFIG.SCENE.GRID_DIVISIONS,
		);
	});

	it("clones mutable arrays so constants are never mutated", () => {
		const { result } = renderHook(() => useCanvasSettings());

		expect(result.current.camera.position).not.toBe(
			GAME_CANVAS_CONFIG.CAMERA.POSITION,
		);
		expect(result.current.renderer.dprRange).not.toBe(
			GAME_CANVAS_CONFIG.RENDERER.DPR_RANGE,
		);
		expect(result.current.environment.floor.size).not.toBe(
			GAME_CANVAS_CONFIG.SCENE.FLOOR_SIZE,
		);
		expect(result.current.lighting.torch.positions).not.toBe(
			GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS,
		);
		expect(result.current.lighting.torch.positions[0]).not.toBe(
			GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS[0],
		);
	});
});
