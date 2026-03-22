import { CAMERA_MODES, type CameraMode } from "@/features/camera-system/config";
import {
	CAMERA_CONFIG,
	type CameraConfig,
	PLAYER_EYE_HEIGHT,
} from "@/shared/config";

import type { CameraStateSnapshot } from "../model/types";

const CAMERA_TARGETS = {
	ORIGIN: [0, 0, 0],
	PLAYER_HEAD: [0, PLAYER_EYE_HEIGHT, 0],
	PLAYER_HEAD_FORWARD: [0, PLAYER_EYE_HEIGHT, 1],
} as const;

const CAMERA_ZOOM = {
	DEFAULT: 1,
} as const;

const createThirdPersonSnapshot = (
	thirdPersonConfig: CameraConfig["THIRD_PERSON"],
): CameraStateSnapshot => ({
	fov: thirdPersonConfig.FOV,
	mode: CAMERA_MODES.THIRD_PERSON,
	position: thirdPersonConfig.OFFSET,
	target: CAMERA_TARGETS.PLAYER_HEAD,
	zoom: CAMERA_ZOOM.DEFAULT,
});

const createTopDownSnapshot = (
	topDownConfig: CameraConfig["TOP_DOWN"],
): CameraStateSnapshot => ({
	fov: topDownConfig.FOV,
	mode: CAMERA_MODES.TOP_DOWN,
	position: [0, topDownConfig.HEIGHT, topDownConfig.DISTANCE],
	target: CAMERA_TARGETS.ORIGIN,
	zoom: CAMERA_ZOOM.DEFAULT,
});

const createFirstPersonSnapshot = (
	firstPersonConfig: CameraConfig["FIRST_PERSON"],
): CameraStateSnapshot => ({
	fov: firstPersonConfig.FOV,
	mode: CAMERA_MODES.FIRST_PERSON,
	position: CAMERA_TARGETS.PLAYER_HEAD,
	target: CAMERA_TARGETS.PLAYER_HEAD_FORWARD,
	zoom: CAMERA_ZOOM.DEFAULT,
});

const createFreeOrbitalSnapshot = (
	freeOrbitalConfig: CameraConfig["FREE_ORBITAL"],
): CameraStateSnapshot => ({
	fov: freeOrbitalConfig.FOV,
	mode: CAMERA_MODES.FREE_ORBITAL,
	position: freeOrbitalConfig.INITIAL_POSITION,
	target: CAMERA_TARGETS.ORIGIN,
	zoom: CAMERA_ZOOM.DEFAULT,
});

export const createCameraStateSnapshot = (
	mode: CameraMode,
): CameraStateSnapshot => {
	if (mode === CAMERA_MODES.THIRD_PERSON) {
		return createThirdPersonSnapshot(CAMERA_CONFIG.THIRD_PERSON);
	}

	if (mode === CAMERA_MODES.TOP_DOWN) {
		return createTopDownSnapshot(CAMERA_CONFIG.TOP_DOWN);
	}

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		return createFirstPersonSnapshot(CAMERA_CONFIG.FIRST_PERSON);
	}

	return createFreeOrbitalSnapshot(CAMERA_CONFIG.FREE_ORBITAL);
};
