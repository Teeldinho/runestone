import { createFloorOneMachine, type DungeonContext } from "@/entities/dungeon";
import { PLAYER_ENTITY_CONFIG } from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import type { CameraStateSnapshot } from "@/features/camera-system";

import { createCanvasMachineSettingsViewModel } from "../lib";

import type { CanvasMachineSettingsViewModel } from "./canvasSettingsTypes";
import { useCanvasSettings } from "./useCanvasSettings";

type CanvasMachineRuntime = Pick<
	DungeonContext,
	"currentRoomId" | "enemiesRemaining" | "hasTreasureKey"
>;

export const useCanvasMachineSettings = (
	machineRuntime: CanvasMachineRuntime,
	cameraStateSnapshot?: CameraStateSnapshot,
	postprocessingEnabled?: boolean,
): CanvasMachineSettingsViewModel => {
	const baseCanvasSettings = useCanvasSettings();
	const floorRooms = createDungeonFloorLayout(createFloorOneMachine()).rooms;

	return createCanvasMachineSettingsViewModel({
		baseCanvasSettings,
		cameraStateSnapshot,
		floorRooms,
		machineRuntime,
		postprocessingEnabled,
		playerSpawnHeightOffset: PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
	});
};

export type { CanvasMachineRuntime };
