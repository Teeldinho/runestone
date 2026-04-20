import {
	DUNGEON_RUNE_STATES,
	DUNGEON_THEME,
	type DungeonContext,
	type DungeonRuneState,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";
import type { DungeonRoomLayout } from "@/entities/room";
import {
	CAMERA_MODES,
	type CameraStateSnapshot,
} from "@/features/camera-system";
import { GAME_CANVAS_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

import {
	CANVAS_FOG_DENSITY_MULTIPLIERS_BY_ROOM,
	CANVAS_FREE_ORBITAL_TORCH_ROOM_LIMIT,
	CANVAS_RUNE_COLORS_BY_STATE,
	CANVAS_RUNE_EMISSIVE_MULTIPLIERS,
	CANVAS_TORCH_INTENSITY_CONFIG,
} from "../config";
import type { createCanvasSettingsViewModel } from "./createCanvasSettingsViewModel";
import { createRoomTorchPositions } from "./createRoomTorchPositions";
import { getRoomWorldPosition } from "./getRoomWorldPosition";
import { selectNearestRoomPositions } from "./selectNearestRoomPositions";

type CanvasMachineRuntimeInput = Pick<
	DungeonContext,
	"currentRoomId" | "enemiesRemaining" | "hasTreasureKey"
>;

type CreateCanvasMachineSettingsViewModelInput = {
	baseCanvasSettings: ReturnType<typeof createCanvasSettingsViewModel>;
	floorRooms: DungeonRoomLayout[];
	machineRuntime: CanvasMachineRuntimeInput;
	cameraStateSnapshot?: CameraStateSnapshot;
	postprocessingEnabled?: boolean;
	playerSpawnHeightOffset: number;
};

const resolveTorchRoomPositions = ({
	currentRoomPosition,
	floorRooms,
	mode,
}: {
	currentRoomPosition: Vector3Tuple | null;
	floorRooms: DungeonRoomLayout[];
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

const resolveRuneState = (
	machineRuntime: CanvasMachineRuntimeInput,
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

const createDefaultPlayerSpawnPosition = (
	playerSpawnHeightOffset: number,
): Vector3Tuple => {
	return [0, playerSpawnHeightOffset, 0];
};

export const createCanvasMachineSettingsViewModel = ({
	baseCanvasSettings,
	cameraStateSnapshot,
	floorRooms,
	machineRuntime,
	postprocessingEnabled,
	playerSpawnHeightOffset,
}: CreateCanvasMachineSettingsViewModelInput) => {
	const runeState = resolveRuneState(machineRuntime);
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
			mode: cameraStateSnapshot?.mode,
		}),
	});
	const playerSpawnPosition =
		getRoomWorldPosition(
			floorRooms,
			machineRuntime.currentRoomId,
			playerSpawnHeightOffset,
		) ?? createDefaultPlayerSpawnPosition(playerSpawnHeightOffset);

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
};

export type {
	CanvasMachineRuntimeInput,
	CreateCanvasMachineSettingsViewModelInput,
};
