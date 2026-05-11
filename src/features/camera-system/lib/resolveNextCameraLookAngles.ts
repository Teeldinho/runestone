import { CAMERA_LOOK_CONFIG } from "../config";
import { clampCameraPitch } from "./clampCameraPitch";

type ResolveNextCameraLookAnglesInput = {
	readonly currentYaw: number;
	readonly currentPitch: number;
	readonly delta: {
		readonly x: number;
		readonly y: number;
	};
};

export type CameraLookAngles = {
	readonly yaw: number;
	readonly pitch: number;
};

export const resolveNextCameraLookAngles = ({
	currentYaw,
	currentPitch,
	delta,
}: ResolveNextCameraLookAnglesInput): CameraLookAngles => ({
	yaw: currentYaw + delta.x * CAMERA_LOOK_CONFIG.YAW_DIRECTION_MULTIPLIER,
	pitch: clampCameraPitch(
		currentPitch + delta.y * CAMERA_LOOK_CONFIG.PITCH_DIRECTION_MULTIPLIER,
	),
});
