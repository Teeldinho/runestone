import {
	CAMERA_LERP_DECAY_RATE,
	CAMERA_LERP_FRAME_COUNT,
	CAMERA_TRANSITION_MS,
	ROOM_CONFIG,
} from "@/shared/config";

export const computeCameraRigLerpAlpha = (
	transitionMs: number = CAMERA_TRANSITION_MS,
): number =>
	1 -
	Math.exp((-CAMERA_LERP_DECAY_RATE * CAMERA_LERP_FRAME_COUNT) / transitionMs);

export const computeCameraRigTransitionJumpDistance = (
	roomWidth: number = ROOM_CONFIG.WIDTH,
): number => roomWidth * 0.5;
