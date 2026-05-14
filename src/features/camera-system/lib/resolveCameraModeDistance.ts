import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_LIMITS, CAMERA_MODE_IDS, type CameraModeId } from "../config";

export const resolveCameraModeDistance = (mode: CameraModeId): number => {
	if (mode === CAMERA_MODE_IDS.TOP_DOWN) {
		return CAMERA_CONFIG.TOP_DOWN.HEIGHT;
	}

	if (mode === CAMERA_MODE_IDS.FIRST_PERSON) {
		return CAMERA_LIMITS.FIRST_PERSON_ORBIT_DISTANCE;
	}

	if (mode === CAMERA_MODE_IDS.FREE_ORBIT) {
		const [x, y, z] = CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION;

		return Math.hypot(x, y, z);
	}

	const [, y, z] = CAMERA_CONFIG.THIRD_PERSON.OFFSET;

	return Math.hypot(y, z);
};
