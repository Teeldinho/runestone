import { DUNGEON_THEME } from "@/entities/dungeon";
import { CAMERA_DEFAULT_ZOOM, GAME_CANVAS_CONFIG } from "@/shared/config";

import { CANVAS_WALL_SURFACE_CONFIG } from "../config";
import type { CanvasSettingsViewModel } from "../model/canvasSettingsTypes";

export const createCanvasSettingsViewModel = (): CanvasSettingsViewModel => {
	return {
		camera: {
			far: GAME_CANVAS_CONFIG.CAMERA.FAR,
			fov: GAME_CANVAS_CONFIG.CAMERA.FOV,
			near: GAME_CANVAS_CONFIG.CAMERA.NEAR,
			position: [...GAME_CANVAS_CONFIG.CAMERA.POSITION] as [
				number,
				number,
				number,
			],
			zoom: CAMERA_DEFAULT_ZOOM,
		},
		environment: {
			floor: {
				color: DUNGEON_THEME.STONE.BASE_COLOR,
				metalness: GAME_CANVAS_CONFIG.SCENE.FLOOR_METALNESS,
				offsetY: GAME_CANVAS_CONFIG.SCENE.FLOOR_OFFSET_Y,
				roughness: GAME_CANVAS_CONFIG.SCENE.FLOOR_ROUGHNESS,
				rotationXRad: GAME_CANVAS_CONFIG.SCENE.FLOOR_ROTATION_X_RAD,
				size: [...GAME_CANVAS_CONFIG.SCENE.FLOOR_SIZE] as [number, number],
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
			wall: {
				color: DUNGEON_THEME.STONE.DETAIL_COLOR,
				roughness: CANVAS_WALL_SURFACE_CONFIG.ROUGHNESS,
				metalness: CANVAS_WALL_SURFACE_CONFIG.METALNESS,
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
					(torchLightPosition) =>
						[...torchLightPosition] as [number, number, number],
				),
			},
		},
		postprocessing: {
			enabled: GAME_CANVAS_CONFIG.POSTPROCESSING.ENABLED_DEFAULT,
			bloom: {
				luminanceThreshold:
					GAME_CANVAS_CONFIG.POSTPROCESSING.BLOOM.LUMINANCE_THRESHOLD,
				luminanceSmoothing:
					GAME_CANVAS_CONFIG.POSTPROCESSING.BLOOM.LUMINANCE_SMOOTHING,
				intensity: GAME_CANVAS_CONFIG.POSTPROCESSING.BLOOM.INTENSITY,
				mipmapBlur: GAME_CANVAS_CONFIG.POSTPROCESSING.BLOOM.MIPMAP_BLUR,
			},
			vignette: {
				offset: GAME_CANVAS_CONFIG.POSTPROCESSING.VIGNETTE.OFFSET,
				darkness: GAME_CANVAS_CONFIG.POSTPROCESSING.VIGNETTE.DARKNESS,
			},
		},
		renderer: {
			dprRange: [...GAME_CANVAS_CONFIG.RENDERER.DPR_RANGE] as [number, number],
			shadowsEnabled: GAME_CANVAS_CONFIG.RENDERER.SHADOWS_ENABLED,
		},
	};
};
