import { CAMERA_MODES, type CameraMode } from "../config";

type CameraDirection = {
	x: number;
	y: number;
	z: number;
};

type ResolveCameraAzimuthInput = {
	mode: CameraMode;
	direction: CameraDirection;
};

export const resolveCameraAzimuth = ({
	mode,
	direction,
}: ResolveCameraAzimuthInput): number | null => {
	if (mode === CAMERA_MODES.TOP_DOWN) {
		return 0;
	}

	const horizontalMagnitude = Math.hypot(direction.x, direction.z);
	if (horizontalMagnitude === 0) {
		return null;
	}

	return Math.atan2(direction.x, direction.z);
};
