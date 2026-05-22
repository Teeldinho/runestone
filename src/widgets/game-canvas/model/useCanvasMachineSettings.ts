import { useMemo } from "react";
import type { DungeonContext } from "@/entities/dungeon";
import { PLAYER_ENTITY_CONFIG } from "@/entities/player";
import type { CameraStateSnapshot } from "@/features/camera-system";
import {
	createCanvasMachineSettingsViewModel,
	createFloorOneDungeonRooms,
} from "../lib";

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
	const floorRooms = useMemo(() => createFloorOneDungeonRooms(), []);
	const { currentRoomId, enemiesRemaining, hasTreasureKey } = machineRuntime;

	return useMemo(
		() =>
			createCanvasMachineSettingsViewModel({
				baseCanvasSettings,
				cameraStateSnapshot,
				floorRooms,
				machineRuntime: {
					currentRoomId,
					enemiesRemaining,
					hasTreasureKey,
				},
				postprocessingEnabled,
				playerSpawnHeightOffset:
					PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			}),
		[
			baseCanvasSettings,
			cameraStateSnapshot,
			floorRooms,
			currentRoomId,
			enemiesRemaining,
			hasTreasureKey,
			postprocessingEnabled,
		],
	);
};

export type { CanvasMachineRuntime };
