import type { Vector3Tuple } from "@/shared/lib";

import {
	CAMERA_CONTROLS_UP_AXIS_KEYS,
	CAMERA_MODE_IDS,
	CAMERA_UP_VECTORS,
	type CameraControlsUpAxisKey,
	type CameraModeId,
} from "../config";

export const resolveCameraControlsUpAxisKey = (
	mode: CameraModeId,
): CameraControlsUpAxisKey =>
	mode === CAMERA_MODE_IDS.TOP_DOWN
		? CAMERA_CONTROLS_UP_AXIS_KEYS.TOP_DOWN
		: CAMERA_CONTROLS_UP_AXIS_KEYS.UPRIGHT;

export const resolveCameraControlsUpVector = (
	mode: CameraModeId,
): Vector3Tuple =>
	mode === CAMERA_MODE_IDS.TOP_DOWN
		? CAMERA_UP_VECTORS.TOP_DOWN
		: CAMERA_UP_VECTORS.DEFAULT;
