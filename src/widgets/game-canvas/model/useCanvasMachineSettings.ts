import { useMemo } from "react";

import {
	DUNGEON_RUNE_STATES,
	DUNGEON_THEME,
	type DungeonContext,
	type DungeonRuneState,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { GAME_CANVAS_CONFIG } from "@/shared/config";

import {
	CANVAS_FOG_DENSITY_MULTIPLIERS_BY_ROOM,
	CANVAS_RUNE_COLORS_BY_STATE,
	CANVAS_RUNE_EMISSIVE_MULTIPLIERS,
	CANVAS_TORCH_INTENSITY_CONFIG,
} from "../config";

import { useCanvasSettings } from "./useCanvasSettings";

type CanvasMachineRuntime = Pick<
	DungeonContext,
	"currentRoomId" | "enemiesRemaining" | "hasTreasureKey"
>;

const getRuneState = (
	machineRuntime: CanvasMachineRuntime,
): DungeonRuneState => {
	if (machineRuntime.currentRoomId === ROOM_IDS.EXIT) {
		return DUNGEON_RUNE_STATES.ACTIVE;
	}

	if (
		machineRuntime.hasTreasureKey &&
		machineRuntime.enemiesRemaining ===
			FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING
	) {
		return DUNGEON_RUNE_STATES.ACTIVE;
	}

	if (machineRuntime.hasTreasureKey) {
		return DUNGEON_RUNE_STATES.OPEN;
	}

	return DUNGEON_RUNE_STATES.SEALED;
};

const clampNumber = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max);

export const useCanvasMachineSettings = (
	machineRuntime: CanvasMachineRuntime,
	cameraStateSnapshot?: CameraStateSnapshot,
) => {
	const baseCanvasSettings = useCanvasSettings();

	return useMemo(() => {
		const runeState = getRuneState(machineRuntime);
		const runeColors = CANVAS_RUNE_COLORS_BY_STATE[runeState];
		const fogDensityMultiplier =
			CANVAS_FOG_DENSITY_MULTIPLIERS_BY_ROOM[machineRuntime.currentRoomId];
		const torchIntensity = clampNumber(
			DUNGEON_THEME.LIGHTING.TORCH_INTENSITY +
				machineRuntime.enemiesRemaining *
					CANVAS_TORCH_INTENSITY_CONFIG.ENEMY_STEP,
			CANVAS_TORCH_INTENSITY_CONFIG.MIN,
			CANVAS_TORCH_INTENSITY_CONFIG.MAX,
		);

		return {
			...baseCanvasSettings,
			camera: {
				...baseCanvasSettings.camera,
				fov: cameraStateSnapshot?.fov ?? baseCanvasSettings.camera.fov,
				position: cameraStateSnapshot
					? ([...cameraStateSnapshot.position] as [number, number, number])
					: baseCanvasSettings.camera.position,
				zoom: cameraStateSnapshot?.zoom ?? baseCanvasSettings.camera.zoom,
			},
			environment: {
				...baseCanvasSettings.environment,
				rune: {
					...baseCanvasSettings.environment.rune,
					activeColor: runeColors.activeColor,
					emissiveIntensity:
						GAME_CANVAS_CONFIG.SCENE.RUNE_EMISSIVE_INTENSITY *
						CANVAS_RUNE_EMISSIVE_MULTIPLIERS[runeState],
					openColor: runeColors.emissiveColor,
				},
			},
			fog: {
				...baseCanvasSettings.fog,
				density: DUNGEON_THEME.FOG.DENSITY * fogDensityMultiplier,
			},
			lighting: {
				...baseCanvasSettings.lighting,
				torch: {
					...baseCanvasSettings.lighting.torch,
					intensity: torchIntensity,
				},
			},
		};
	}, [baseCanvasSettings, cameraStateSnapshot, machineRuntime]);
};

export type { CanvasMachineRuntime };
