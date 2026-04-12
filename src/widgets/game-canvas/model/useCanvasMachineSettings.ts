import { useMemo } from "react";

import {
	createFloorOneMachine,
	DUNGEON_RUNE_STATES,
	DUNGEON_THEME,
	type DungeonContext,
	type DungeonRuneState,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";
import { PLAYER_ENTITY_CONFIG } from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	CAMERA_MODES,
	type CameraStateSnapshot,
} from "@/features/camera-system";
import { GAME_CANVAS_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import {
	CANVAS_FOG_DENSITY_MULTIPLIERS_BY_ROOM,
	CANVAS_FREE_ORBITAL_TORCH_ROOM_LIMIT,
	CANVAS_RUNE_COLORS_BY_STATE,
	CANVAS_RUNE_EMISSIVE_MULTIPLIERS,
	CANVAS_TORCH_INTENSITY_CONFIG,
} from "../config";
import {
	createRoomTorchPositions,
	getRoomWorldPosition,
	selectNearestRoomPositions,
} from "../lib";

import { useCanvasSettings } from "./useCanvasSettings";

type CanvasMachineRuntime = Pick<
	DungeonContext,
	"currentRoomId" | "enemiesRemaining" | "hasTreasureKey"
>;

const resolveTorchRoomPositions = ({
	currentRoomPosition,
	floorRooms,
	mode,
}: {
	currentRoomPosition: Vector3Tuple | null;
	floorRooms: ReturnType<typeof createDungeonFloorLayout>["rooms"];
	mode: CameraStateSnapshot["mode"] | undefined;
}): Vector3Tuple[] => {
	const roomPositions = floorRooms.map((room) => room.position);

	if (mode === CAMERA_MODES.FREE_ORBITAL) {
		return selectNearestRoomPositions({
			roomPositions,
			currentRoomPosition,
			maxRoomCount: CANVAS_FREE_ORBITAL_TORCH_ROOM_LIMIT,
		});
	}

	return currentRoomPosition ? [currentRoomPosition] : [];
};

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
	postprocessingEnabled?: boolean,
) => {
	const baseCanvasSettings = useCanvasSettings();
	const floorRooms = useMemo(
		() => createDungeonFloorLayout(createFloorOneMachine()).rooms,
		[],
	);

	return useMemo(() => {
		const cameraMode = cameraStateSnapshot?.mode;
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
		const currentRoomPosition = getRoomWorldPosition(
			floorRooms,
			machineRuntime.currentRoomId,
			0,
		);
		const roomTorchPositions = createRoomTorchPositions({
			localTorchPositions: GAME_CANVAS_CONFIG.SCENE.TORCH_POSITIONS,
			roomPositions: resolveTorchRoomPositions({
				currentRoomPosition,
				floorRooms,
				mode: cameraMode,
			}),
		});
		const playerSpawnPosition =
			getRoomWorldPosition(
				floorRooms,
				machineRuntime.currentRoomId,
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			) ??
			([
				0,
				PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
				0,
			] as Vector3Tuple);

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
					positions: roomTorchPositions,
				},
			},
			isPostprocessingEnabled:
				baseCanvasSettings.postprocessing.enabled &&
				(postprocessingEnabled ?? true),
			playerSpawnPosition,
		};
	}, [
		baseCanvasSettings,
		cameraStateSnapshot,
		floorRooms,
		machineRuntime,
		postprocessingEnabled,
	]);
};

export type { CanvasMachineRuntime };
