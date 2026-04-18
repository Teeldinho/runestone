import { describe, expect, it } from "vitest";

import { DUNGEON_THEME } from "@/entities/dungeon";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

import { CANVAS_WALL_SURFACE_CONFIG } from "../config";

import { createCanvasSettingsViewModel } from "./createCanvasSettingsViewModel";

describe("createCanvasSettingsViewModel", () => {
	it("maps dungeon and canvas constants into a settings view model", () => {
		const settings = createCanvasSettingsViewModel();

		expect(settings.fog.color).toBe(DUNGEON_THEME.FOG.COLOR);
		expect(settings.fog.density).toBe(DUNGEON_THEME.FOG.DENSITY);
		expect(settings.camera.fov).toBe(GAME_CANVAS_CONFIG.CAMERA.FOV);
		expect(settings.renderer.shadowsEnabled).toBe(
			GAME_CANVAS_CONFIG.RENDERER.SHADOWS_ENABLED,
		);
		expect(settings.environment.wall.roughness).toBe(
			CANVAS_WALL_SURFACE_CONFIG.ROUGHNESS,
		);
		expect(settings.environment.wall.metalness).toBe(
			CANVAS_WALL_SURFACE_CONFIG.METALNESS,
		);
	});

	it("clones mutable tuple arrays so config constants remain immutable", () => {
		const settings = createCanvasSettingsViewModel();

		expect(settings.camera.position).not.toBe(
			GAME_CANVAS_CONFIG.CAMERA.POSITION,
		);
		expect(settings.renderer.dprRange).not.toBe(
			GAME_CANVAS_CONFIG.RENDERER.DPR_RANGE,
		);
		expect(settings.environment.floor.size).not.toBe(
			GAME_CANVAS_CONFIG.SCENE.FLOOR_SIZE,
		);
		expect(settings.lighting.torch.positions).not.toBe(
			GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS,
		);
		expect(settings.lighting.torch.positions[0]).not.toBe(
			GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS[0],
		);
	});
});
