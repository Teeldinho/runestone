import { CAMERA_LIMITS, CAMERA_MODE_IDS, type CameraModeId } from "../config";

export type CameraPolarLimits = {
	readonly minPolarAngle: number;
	readonly maxPolarAngle: number;
};

export const resolveCameraPolarLimits = (
	mode: CameraModeId,
): CameraPolarLimits => {
	if (mode === CAMERA_MODE_IDS.TOP_DOWN) {
		return {
			minPolarAngle: CAMERA_LIMITS.TOP_DOWN_POLAR_ANGLE,
			maxPolarAngle: CAMERA_LIMITS.TOP_DOWN_POLAR_ANGLE,
		};
	}

	if (mode === CAMERA_MODE_IDS.FREE_ORBIT) {
		return {
			minPolarAngle: CAMERA_LIMITS.FREE_ORBIT_MIN_POLAR_ANGLE,
			maxPolarAngle: CAMERA_LIMITS.FREE_ORBIT_MAX_POLAR_ANGLE,
		};
	}

	return {
		minPolarAngle: CAMERA_LIMITS.THIRD_PERSON_MIN_POLAR_ANGLE,
		maxPolarAngle: CAMERA_LIMITS.THIRD_PERSON_MAX_POLAR_ANGLE,
	};
};
