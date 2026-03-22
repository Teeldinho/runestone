import { useMemo } from "react";

import {
	DUNGEON_THEME,
	type DungeonContext,
	type DungeonRuneState,
	ROOM_IDS,
} from "@/entities/dungeon";
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
		return "active";
	}

	if (machineRuntime.hasTreasureKey && machineRuntime.enemiesRemaining === 0) {
		return "active";
	}

	if (machineRuntime.hasTreasureKey) {
		return "open";
	}

	return "sealed";
};

const clampNumber = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max);

export const useCanvasMachineSettings = (
	machineRuntime: CanvasMachineRuntime,
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
	}, [baseCanvasSettings, machineRuntime]);
};

export type { CanvasMachineRuntime };
