import { CAMERA_LIMITS } from "../config";

export const clampCameraDistance = (distance: number): number =>
	Math.min(
		CAMERA_LIMITS.MAX_DISTANCE,
		Math.max(CAMERA_LIMITS.MIN_DISTANCE, distance),
	);
