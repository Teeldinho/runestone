import { useMemo } from "react";

import { DUNGEON_THEME } from "@/entities/dungeon";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

type CanvasSettingsViewModel = {
	ambientLightColor: string;
	ambientLightIntensity: number;
	cameraFar: number;
	cameraFov: number;
	cameraNear: number;
	cameraPosition: readonly [number, number, number];
	detailStoneColor: string;
	dprRange: readonly [number, number];
	floorColor: string;
	floorOffsetY: number;
	floorSize: readonly [number, number];
	fogColor: string;
	fogDensity: number;
	pillarHeight: number;
	pillarRadius: number;
	runeActiveColor: string;
	runeOpenColor: string;
	runeOrbHeight: number;
	runeOrbRadius: number;
	runeSealedColor: string;
	shadowsEnabled: boolean;
	torchLightColor: string;
	torchLightDecay: number;
	torchLightDistance: number;
	torchLightIntensity: number;
	torchLightPositions: readonly (readonly [number, number, number])[];
};

export const useCanvasSettings = (): CanvasSettingsViewModel => {
	return useMemo(
		() => ({
			ambientLightColor: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
			ambientLightIntensity: DUNGEON_THEME.LIGHTING.AMBIENT_INTENSITY,
			cameraFar: GAME_CANVAS_CONFIG.CAMERA.FAR,
			cameraFov: GAME_CANVAS_CONFIG.CAMERA.FOV,
			cameraNear: GAME_CANVAS_CONFIG.CAMERA.NEAR,
			cameraPosition: GAME_CANVAS_CONFIG.CAMERA.POSITION,
			detailStoneColor: DUNGEON_THEME.STONE.DETAIL_COLOR,
			dprRange: GAME_CANVAS_CONFIG.RENDERER.DPR_RANGE,
			floorColor: DUNGEON_THEME.STONE.BASE_COLOR,
			floorOffsetY: GAME_CANVAS_CONFIG.SCENE.FLOOR_OFFSET_Y,
			floorSize: GAME_CANVAS_CONFIG.SCENE.FLOOR_SIZE,
			fogColor: DUNGEON_THEME.FOG.COLOR,
			fogDensity: DUNGEON_THEME.FOG.DENSITY,
			pillarHeight: GAME_CANVAS_CONFIG.SCENE.PILLAR_HEIGHT,
			pillarRadius: GAME_CANVAS_CONFIG.SCENE.PILLAR_RADIUS,
			runeActiveColor: DUNGEON_THEME.RUNES.ACTIVE,
			runeOpenColor: DUNGEON_THEME.RUNES.OPEN,
			runeOrbHeight: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_HEIGHT,
			runeOrbRadius: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_RADIUS,
			runeSealedColor: DUNGEON_THEME.RUNES.SEALED,
			shadowsEnabled: GAME_CANVAS_CONFIG.RENDERER.SHADOWS_ENABLED,
			torchLightColor: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
			torchLightDecay: GAME_CANVAS_CONFIG.SCENE.TORCH_LIGHT_DECAY,
			torchLightDistance: GAME_CANVAS_CONFIG.SCENE.TORCH_LIGHT_DISTANCE,
			torchLightIntensity: DUNGEON_THEME.LIGHTING.TORCH_INTENSITY,
			torchLightPositions: GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS,
		}),
		[],
	);
};

export type { CanvasSettingsViewModel };
