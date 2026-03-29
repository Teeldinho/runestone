import { CAMERA_MODES, type CameraMode } from "@/features/camera-system";
import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

type GetCameraRigTargetsInput = {
	mode: CameraMode;
	playerPosition: Vector3Tuple;
};

type CameraRigTargets = {
	lookAt: Vector3Tuple;
	position: Vector3Tuple;
};

export const getCameraRigTargets = ({
	mode,
	playerPosition,
}: GetCameraRigTargetsInput): CameraRigTargets => {
	const [px, py, pz] = playerPosition;

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		return {
			position: [px, py + PLAYER_EYE_HEIGHT, pz],
			lookAt: [px, py + PLAYER_EYE_HEIGHT, pz + 1],
		};
	}

	if (mode === CAMERA_MODES.THIRD_PERSON) {
		const [ox, oy, oz] = CAMERA_CONFIG.THIRD_PERSON.OFFSET;

		return {
			position: [px + ox, py + oy, pz + oz],
			lookAt: [px, py + PLAYER_EYE_HEIGHT, pz],
		};
	}

	if (mode === CAMERA_MODES.TOP_DOWN) {
		return {
			position: [px, CAMERA_CONFIG.TOP_DOWN.HEIGHT, pz],
			lookAt: [px, py, pz],
		};
	}

	const [ox, oy, oz] = CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION;

	return {
		position: [px + ox, py + oy, pz + oz],
		lookAt: [px, py, pz],
	};
};

export type { CameraRigTargets, GetCameraRigTargetsInput };
