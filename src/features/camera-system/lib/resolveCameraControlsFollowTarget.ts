import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

import { CAMERA_MODE_IDS, type CameraModeId } from "../config";

type ResolveCameraControlsFollowTargetInput = {
	readonly mode: CameraModeId;
	readonly playerPosition: Vector3Tuple;
};

export const resolveCameraControlsFollowTarget = ({
	mode,
	playerPosition,
}: ResolveCameraControlsFollowTargetInput): Vector3Tuple => {
	const [playerX, playerY, playerZ] = playerPosition;

	if (mode === CAMERA_MODE_IDS.TOP_DOWN) {
		return [playerX, playerY, playerZ];
	}

	if (mode === CAMERA_MODE_IDS.FREE_ORBIT) {
		return [
			playerX,
			playerY + CAMERA_CONFIG.FREE_ORBITAL.TARGET_OFFSET_Y,
			playerZ,
		];
	}

	return [playerX, playerY + PLAYER_EYE_HEIGHT, playerZ];
};

export type { ResolveCameraControlsFollowTargetInput };
