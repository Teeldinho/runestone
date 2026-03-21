import { useMemo } from "react";

import { DUNGEON_THEME } from "@/entities/dungeon";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

type CanvasSettingsViewModel = {
	ambientLightColor: string;
	ambientLightIntensity: number;
	cameraFar: number;
	cameraFov: number;
	cameraNear: number;
	cameraPosition: [number, number, number];
	detailStoneColor: string;
	dprRange: [number, number];
	floorColor: string;
	floorMetalness: number;
	floorOffsetY: number;
	floorRoughness: number;
	floorRotationXRad: number;
	floorSize: [number, number];
	fogColor: string;
	fogDensity: number;
	gridDivisions: number;
	gridOffsetY: number;
	gridSize: number;
	pillarHeight: number;
	pillarMetalness: number;
	pillarPositionY: number;
	pillarRadius: number;
	pillarRadialSegments: number;
	pillarRoughness: number;
	runeActiveColor: string;
	runeOpenColor: string;
	runeOrbHeightSegments: number;
	runeOrbHeight: number;
	runeOrbRadius: number;
	runeOrbWidthSegments: number;
	runeEmissiveIntensity: number;
	runeSealedColor: string;
	shadowsEnabled: boolean;
	torchLightColor: string;
	torchLightDecay: number;
	torchLightDistance: number;
	torchLightIntensity: number;
	torchLightPositions: [number, number, number][];
};

export const useCanvasSettings = (): CanvasSettingsViewModel => {
	return useMemo(
		() => ({
			ambientLightColor: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
			ambientLightIntensity: DUNGEON_THEME.LIGHTING.AMBIENT_INTENSITY,
			cameraFar: GAME_CANVAS_CONFIG.CAMERA.FAR,
			cameraFov: GAME_CANVAS_CONFIG.CAMERA.FOV,
			cameraNear: GAME_CANVAS_CONFIG.CAMERA.NEAR,
			cameraPosition: [...GAME_CANVAS_CONFIG.CAMERA.POSITION],
			detailStoneColor: DUNGEON_THEME.STONE.DETAIL_COLOR,
			dprRange: [...GAME_CANVAS_CONFIG.RENDERER.DPR_RANGE],
			floorColor: DUNGEON_THEME.STONE.BASE_COLOR,
			floorMetalness: GAME_CANVAS_CONFIG.SCENE.FLOOR_METALNESS,
			floorOffsetY: GAME_CANVAS_CONFIG.SCENE.FLOOR_OFFSET_Y,
			floorRoughness: GAME_CANVAS_CONFIG.SCENE.FLOOR_ROUGHNESS,
			floorRotationXRad: GAME_CANVAS_CONFIG.SCENE.FLOOR_ROTATION_X_RAD,
			floorSize: [...GAME_CANVAS_CONFIG.SCENE.FLOOR_SIZE],
			fogColor: DUNGEON_THEME.FOG.COLOR,
			fogDensity: DUNGEON_THEME.FOG.DENSITY,
			gridDivisions: GAME_CANVAS_CONFIG.SCENE.GRID_DIVISIONS,
			gridOffsetY: GAME_CANVAS_CONFIG.SCENE.GRID_OFFSET_Y,
			gridSize: GAME_CANVAS_CONFIG.SCENE.GRID_SIZE,
			pillarHeight: GAME_CANVAS_CONFIG.SCENE.PILLAR_HEIGHT,
			pillarMetalness: GAME_CANVAS_CONFIG.SCENE.PILLAR_METALNESS,
			pillarPositionY: GAME_CANVAS_CONFIG.SCENE.PILLAR_POSITION_Y,
			pillarRadius: GAME_CANVAS_CONFIG.SCENE.PILLAR_RADIUS,
			pillarRadialSegments: GAME_CANVAS_CONFIG.SCENE.PILLAR_RADIAL_SEGMENTS,
			pillarRoughness: GAME_CANVAS_CONFIG.SCENE.PILLAR_ROUGHNESS,
			runeActiveColor: DUNGEON_THEME.RUNES.ACTIVE,
			runeEmissiveIntensity: GAME_CANVAS_CONFIG.SCENE.RUNE_EMISSIVE_INTENSITY,
			runeOpenColor: DUNGEON_THEME.RUNES.OPEN,
			runeOrbHeightSegments: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_HEIGHT_SEGMENTS,
			runeOrbHeight: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_HEIGHT,
			runeOrbRadius: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_RADIUS,
			runeOrbWidthSegments: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_WIDTH_SEGMENTS,
			runeSealedColor: DUNGEON_THEME.RUNES.SEALED,
			shadowsEnabled: GAME_CANVAS_CONFIG.RENDERER.SHADOWS_ENABLED,
			torchLightColor: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
			torchLightDecay: GAME_CANVAS_CONFIG.SCENE.TORCH_LIGHT_DECAY,
			torchLightDistance: GAME_CANVAS_CONFIG.SCENE.TORCH_LIGHT_DISTANCE,
			torchLightIntensity: DUNGEON_THEME.LIGHTING.TORCH_INTENSITY,
			torchLightPositions: GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS.map(
				(torchLightPosition) => [...torchLightPosition],
			),
		}),
		[],
	);
};

export type { CanvasSettingsViewModel };
