import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

import { CAMERA_LIMITS, CAMERA_MODE_IDS, type CameraModeId } from "../config";

const resolveForwardVector = ({
	cameraPitch,
	cameraYaw,
	distance,
}: {
	readonly cameraPitch: number;
	readonly cameraYaw: number;
	readonly distance: number;
}): Vector3Tuple => {
	const horizontalDistance = Math.cos(cameraPitch) * distance;

	return [
		Math.sin(cameraYaw) * horizontalDistance,
		Math.sin(cameraPitch) * distance,
		Math.cos(cameraYaw) * horizontalDistance,
	];
};

type ResolveOrbitControlsTargetPositionInput = {
	readonly cameraMode: CameraModeId;
	readonly cameraPitch: number;
	readonly cameraYaw: number;
	readonly distance: number;
	readonly playerPosition: Vector3Tuple;
};

export const resolveOrbitControlsTargetPosition = ({
	cameraMode,
	cameraPitch,
	cameraYaw,
	distance,
	playerPosition,
}: ResolveOrbitControlsTargetPositionInput): Vector3Tuple => {
	const [playerX, playerY, playerZ] = playerPosition;

	if (cameraMode === CAMERA_MODE_IDS.TOP_DOWN) {
		return [playerX, playerY, playerZ];
	}

	if (cameraMode === CAMERA_MODE_IDS.FREE_ORBIT) {
		return [
			playerX,
			playerY + CAMERA_CONFIG.FREE_ORBITAL.TARGET_OFFSET_Y,
			playerZ,
		];
	}

	if (cameraMode === CAMERA_MODE_IDS.FIRST_PERSON) {
		const forwardVector = resolveForwardVector({
			cameraPitch,
			cameraYaw,
			distance: distance || CAMERA_LIMITS.FIRST_PERSON_ORBIT_DISTANCE,
		});

		return [
			playerX + forwardVector[0],
			playerY + PLAYER_EYE_HEIGHT + forwardVector[1],
			playerZ + forwardVector[2],
		];
	}

	return [playerX, playerY + PLAYER_EYE_HEIGHT, playerZ];
};
