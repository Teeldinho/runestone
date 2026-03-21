// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DUNGEON_THEME } from "@/entities/dungeon";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

import { useCanvasSettings } from "./useCanvasSettings";

describe("useCanvasSettings", () => {
	it("returns fog and lighting values from dungeon theme constants", () => {
		const { result } = renderHook(() => useCanvasSettings());

		expect(result.current.fogColor).toBe(DUNGEON_THEME.FOG.COLOR);
		expect(result.current.fogDensity).toBe(DUNGEON_THEME.FOG.DENSITY);
		expect(result.current.torchLightColor).toBe(
			DUNGEON_THEME.LIGHTING.TORCH_COLOR,
		);
		expect(result.current.torchLightIntensity).toBe(
			DUNGEON_THEME.LIGHTING.TORCH_INTENSITY,
		);
		expect(result.current.ambientLightIntensity).toBe(
			DUNGEON_THEME.LIGHTING.AMBIENT_INTENSITY,
		);
	});

	it("returns camera and renderer values from canvas config constants", () => {
		const { result } = renderHook(() => useCanvasSettings());

		expect(result.current.cameraFov).toBe(GAME_CANVAS_CONFIG.CAMERA.FOV);
		expect(result.current.cameraPosition).toEqual(
			GAME_CANVAS_CONFIG.CAMERA.POSITION,
		);
		expect(result.current.dprRange).toEqual(
			GAME_CANVAS_CONFIG.RENDERER.DPR_RANGE,
		);
		expect(result.current.shadowsEnabled).toBe(
			GAME_CANVAS_CONFIG.RENDERER.SHADOWS_ENABLED,
		);
	});
});
