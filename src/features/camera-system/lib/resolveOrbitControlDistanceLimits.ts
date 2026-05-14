import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_LIMITS, CAMERA_MODE_IDS, type CameraModeId } from "../config";

export type OrbitControlDistanceLimits = {
	readonly maxDistance: number;
	readonly minDistance: number;
};

export const resolveOrbitControlDistanceLimits = (
	mode: CameraModeId,
): OrbitControlDistanceLimits => {
	if (mode === CAMERA_MODE_IDS.TOP_DOWN) {
		return {
			maxDistance: CAMERA_CONFIG.TOP_DOWN.MAX_DISTANCE,
			minDistance: CAMERA_CONFIG.TOP_DOWN.MIN_DISTANCE,
		};
	}

	if (mode === CAMERA_MODE_IDS.FIRST_PERSON) {
		return {
			maxDistance: CAMERA_LIMITS.FIRST_PERSON_ORBIT_DISTANCE,
			minDistance: CAMERA_LIMITS.FIRST_PERSON_ORBIT_DISTANCE,
		};
	}

	if (mode === CAMERA_MODE_IDS.FREE_ORBIT) {
		return {
			maxDistance: CAMERA_CONFIG.FREE_ORBITAL.MAX_DISTANCE,
			minDistance: CAMERA_CONFIG.FREE_ORBITAL.MIN_DISTANCE,
		};
	}

	return {
		maxDistance: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_DISTANCE,
		minDistance: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_DISTANCE,
	};
};
