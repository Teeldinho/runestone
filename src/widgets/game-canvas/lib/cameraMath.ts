import { CAMERA_TRANSITION_MS, ROOM_CONFIG } from "@/shared/config";

export const computeCameraRigLerpAlpha = (
	transitionMs: number = CAMERA_TRANSITION_MS,
): number => 1 - Math.exp((-4 * 16) / transitionMs);

export const computeCameraRigTransitionJumpDistance = (
	roomWidth: number = ROOM_CONFIG.WIDTH,
): number => roomWidth * 0.5;
