import {
	CAMERA_MODES,
	CAMERA_STATE_TARGETS,
	type CameraMode,
} from "@/features/camera-system/config";
import {
	CAMERA_CONFIG,
	CAMERA_DEFAULT_ZOOM,
	type CameraConfig,
} from "@/shared/config";

import type { CameraStateSnapshot } from "../model/types";

const DEFAULT_YAW = 0;
const DEFAULT_PITCH = 0;
const DEFAULT_DISTANCE = 6;

const createThirdPersonSnapshot = (
	thirdPersonConfig: CameraConfig["THIRD_PERSON"],
): CameraStateSnapshot => ({
	fov: thirdPersonConfig.FOV,
	mode: CAMERA_MODES.THIRD_PERSON,
	position: thirdPersonConfig.OFFSET,
	target: CAMERA_STATE_TARGETS.PLAYER_HEAD,
	zoom: CAMERA_DEFAULT_ZOOM,
	yaw: DEFAULT_YAW,
	pitch: DEFAULT_PITCH,
	distance: DEFAULT_DISTANCE,
});

const createTopDownSnapshot = (
	topDownConfig: CameraConfig["TOP_DOWN"],
): CameraStateSnapshot => ({
	fov: topDownConfig.FOV,
	mode: CAMERA_MODES.TOP_DOWN,
	position: [0, topDownConfig.HEIGHT, topDownConfig.DISTANCE],
	target: CAMERA_STATE_TARGETS.ORIGIN,
	zoom: CAMERA_DEFAULT_ZOOM,
	yaw: DEFAULT_YAW,
	pitch: DEFAULT_PITCH,
	distance: DEFAULT_DISTANCE,
});

const createFirstPersonSnapshot = (
	firstPersonConfig: CameraConfig["FIRST_PERSON"],
): CameraStateSnapshot => ({
	fov: firstPersonConfig.FOV,
	mode: CAMERA_MODES.FIRST_PERSON,
	position: CAMERA_STATE_TARGETS.PLAYER_HEAD,
	target: CAMERA_STATE_TARGETS.PLAYER_HEAD_FORWARD,
	zoom: CAMERA_DEFAULT_ZOOM,
	yaw: DEFAULT_YAW,
	pitch: DEFAULT_PITCH,
	distance: DEFAULT_DISTANCE,
});

const createFreeOrbitalSnapshot = (
	freeOrbitalConfig: CameraConfig["FREE_ORBITAL"],
): CameraStateSnapshot => ({
	fov: freeOrbitalConfig.FOV,
	mode: CAMERA_MODES.FREE_ORBITAL,
	position: freeOrbitalConfig.INITIAL_POSITION,
	target: CAMERA_STATE_TARGETS.ORIGIN,
	zoom: CAMERA_DEFAULT_ZOOM,
	yaw: DEFAULT_YAW,
	pitch: DEFAULT_PITCH,
	distance: DEFAULT_DISTANCE,
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
