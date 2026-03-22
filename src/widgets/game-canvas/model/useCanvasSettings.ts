import { useMemo } from "react";

import { DUNGEON_THEME } from "@/entities/dungeon";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

type CanvasCameraSettings = {
	far: number;
	fov: number;
	near: number;
	position: [number, number, number];
	zoom: number;
};

const CAMERA_ZOOM = {
	DEFAULT: 1,
} as const;

type CanvasRendererSettings = {
	dprRange: [number, number];
	shadowsEnabled: boolean;
};

type CanvasFogSettings = {
	color: string;
	density: number;
};

type CanvasLightingSettings = {
	ambient: {
		color: string;
		intensity: number;
	};
	torch: {
		color: string;
		decay: number;
		distance: number;
		intensity: number;
		positions: [number, number, number][];
	};
};

type CanvasEnvironmentSettings = {
	floor: {
		color: string;
		metalness: number;
		offsetY: number;
		roughness: number;
		rotationXRad: number;
		size: [number, number];
	};
	grid: {
		divisions: number;
		offsetY: number;
		size: number;
	};
	pillar: {
		color: string;
		height: number;
		metalness: number;
		positionY: number;
		radius: number;
		radialSegments: number;
		roughness: number;
	};
	rune: {
		activeColor: string;
		emissiveIntensity: number;
		openColor: string;
		orbHeight: number;
		orbHeightSegments: number;
		orbRadius: number;
		orbWidthSegments: number;
		sealedColor: string;
	};
};

type CanvasSettingsViewModel = {
	camera: CanvasCameraSettings;
	environment: CanvasEnvironmentSettings;
	fog: CanvasFogSettings;
	lighting: CanvasLightingSettings;
	renderer: CanvasRendererSettings;
};

export const useCanvasSettings = (): CanvasSettingsViewModel => {
	return useMemo(
		() => ({
			camera: {
				far: GAME_CANVAS_CONFIG.CAMERA.FAR,
				fov: GAME_CANVAS_CONFIG.CAMERA.FOV,
				near: GAME_CANVAS_CONFIG.CAMERA.NEAR,
				position: [...GAME_CANVAS_CONFIG.CAMERA.POSITION],
				zoom: CAMERA_ZOOM.DEFAULT,
			},
			environment: {
				floor: {
					color: DUNGEON_THEME.STONE.BASE_COLOR,
					metalness: GAME_CANVAS_CONFIG.SCENE.FLOOR_METALNESS,
					offsetY: GAME_CANVAS_CONFIG.SCENE.FLOOR_OFFSET_Y,
					roughness: GAME_CANVAS_CONFIG.SCENE.FLOOR_ROUGHNESS,
					rotationXRad: GAME_CANVAS_CONFIG.SCENE.FLOOR_ROTATION_X_RAD,
					size: [...GAME_CANVAS_CONFIG.SCENE.FLOOR_SIZE],
				},
				grid: {
					divisions: GAME_CANVAS_CONFIG.SCENE.GRID_DIVISIONS,
					offsetY: GAME_CANVAS_CONFIG.SCENE.GRID_OFFSET_Y,
					size: GAME_CANVAS_CONFIG.SCENE.GRID_SIZE,
				},
				pillar: {
					color: DUNGEON_THEME.STONE.DETAIL_COLOR,
					height: GAME_CANVAS_CONFIG.SCENE.PILLAR_HEIGHT,
					metalness: GAME_CANVAS_CONFIG.SCENE.PILLAR_METALNESS,
					positionY: GAME_CANVAS_CONFIG.SCENE.PILLAR_POSITION_Y,
					radius: GAME_CANVAS_CONFIG.SCENE.PILLAR_RADIUS,
					radialSegments: GAME_CANVAS_CONFIG.SCENE.PILLAR_RADIAL_SEGMENTS,
					roughness: GAME_CANVAS_CONFIG.SCENE.PILLAR_ROUGHNESS,
				},
				rune: {
					activeColor: DUNGEON_THEME.RUNES.ACTIVE,
					emissiveIntensity: GAME_CANVAS_CONFIG.SCENE.RUNE_EMISSIVE_INTENSITY,
					openColor: DUNGEON_THEME.RUNES.OPEN,
					orbHeight: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_HEIGHT,
					orbHeightSegments: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_HEIGHT_SEGMENTS,
					orbRadius: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_RADIUS,
					orbWidthSegments: GAME_CANVAS_CONFIG.SCENE.RUNE_ORB_WIDTH_SEGMENTS,
					sealedColor: DUNGEON_THEME.RUNES.SEALED,
				},
			},
			fog: {
				color: DUNGEON_THEME.FOG.COLOR,
				density: DUNGEON_THEME.FOG.DENSITY,
			},
			lighting: {
				ambient: {
					color: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
					intensity: DUNGEON_THEME.LIGHTING.AMBIENT_INTENSITY,
				},
				torch: {
					color: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
					decay: GAME_CANVAS_CONFIG.SCENE.TORCH_LIGHT_DECAY,
					distance: GAME_CANVAS_CONFIG.SCENE.TORCH_LIGHT_DISTANCE,
					intensity: DUNGEON_THEME.LIGHTING.TORCH_INTENSITY,
					positions: GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS.map(
						(torchLightPosition) => [...torchLightPosition],
					),
				},
			},
			renderer: {
				dprRange: [...GAME_CANVAS_CONFIG.RENDERER.DPR_RANGE],
				shadowsEnabled: GAME_CANVAS_CONFIG.RENDERER.SHADOWS_ENABLED,
			},
		}),
		[],
	);
};

export type {
	CanvasCameraSettings,
	CanvasEnvironmentSettings,
	CanvasFogSettings,
	CanvasLightingSettings,
	CanvasRendererSettings,
	CanvasSettingsViewModel,
};
