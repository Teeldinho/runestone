import { CAMERA_LOOK_LIMITS } from "../config";

export const clampCameraPitch = (pitch: number): number =>
	Math.min(
		CAMERA_LOOK_LIMITS.MAX_PITCH,
		Math.max(CAMERA_LOOK_LIMITS.MIN_PITCH, pitch),
	);
