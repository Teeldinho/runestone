import {
	CAMERA_CONFIG,
	CAMERA_MODES,
	TOP_DOWN_CAMERA_LOCKED_AZIMUTH_ANGLE,
	TOP_DOWN_CAMERA_POLAR_ANGLE,
} from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

export const CAMERA_MODE_IDS = {
	THIRD_PERSON: CAMERA_MODES.THIRD_PERSON,
	TOP_DOWN: CAMERA_MODES.TOP_DOWN,
	FIRST_PERSON: CAMERA_MODES.FIRST_PERSON,
	FREE_ORBIT: CAMERA_MODES.FREE_ORBITAL,
} as const;

export type CameraModeId =
	(typeof CAMERA_MODE_IDS)[keyof typeof CAMERA_MODE_IDS];

export const CAMERA_CONTROLS_CONSTANTS = {
	FOV_EPSILON: 0.01,
	FOLLOW_TARGET_EPSILON: 0.0001,
	FIRST_PERSON_DISTANCE_EPSILON: 0.01,
	MODE_TRANSITION_ENABLED: false,
	FOLLOW_TRANSITION_ENABLED: false,
	WORLD_FACING_AZIMUTH_OFFSET: Math.PI,
	DEFAULT_WORLD_FACING_AZIMUTH: 0,
} as const;

export const CAMERA_POINTER_LOCK_DOM_EVENTS = {
	POINTER_DOWN: "pointerdown",
	POINTER_LOCK_CHANGE: "pointerlockchange",
} as const;

export const CAMERA_CONTROLS_UP_AXIS_KEYS = {
	UPRIGHT: "upright",
	TOP_DOWN: "topDown",
} as const;

export type CameraControlsUpAxisKey =
	(typeof CAMERA_CONTROLS_UP_AXIS_KEYS)[keyof typeof CAMERA_CONTROLS_UP_AXIS_KEYS];

export const CAMERA_UP_VECTORS = {
	DEFAULT: [0, 1, 0] as Vector3Tuple,
	TOP_DOWN: [0, 0, 1] as Vector3Tuple,
} as const;

export const CAMERA_CONTROLS_TOP_DOWN_AZIMUTH =
	TOP_DOWN_CAMERA_LOCKED_AZIMUTH_ANGLE;

export const CAMERA_CONTROLS_MODE_POLICY = {
	[CAMERA_MODE_IDS.THIRD_PERSON]: {
		minDistance: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_DISTANCE,
		maxDistance: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_DISTANCE,
		minPolarAngle: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_POLAR_ANGLE,
		maxPolarAngle: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_POLAR_ANGLE,
		smoothTime: 0.18,
		draggingSmoothTime: 0.08,
		azimuthRotateSpeed: 1,
		polarRotateSpeed: 1,
		dollySpeed: 1,
		truckSpeed: 0,
	},
	[CAMERA_MODE_IDS.TOP_DOWN]: {
		minDistance: CAMERA_CONFIG.TOP_DOWN.MIN_DISTANCE,
		maxDistance: CAMERA_CONFIG.TOP_DOWN.MAX_DISTANCE,
		minPolarAngle: TOP_DOWN_CAMERA_POLAR_ANGLE,
		maxPolarAngle: TOP_DOWN_CAMERA_POLAR_ANGLE,
		smoothTime: 0.18,
		draggingSmoothTime: 0.08,
		azimuthRotateSpeed: 0,
		polarRotateSpeed: 0,
		dollySpeed: CAMERA_CONFIG.TOP_DOWN.ZOOM_SPEED,
		truckSpeed: 0,
	},
	[CAMERA_MODE_IDS.FIRST_PERSON]: {
		minDistance: CAMERA_CONTROLS_CONSTANTS.FIRST_PERSON_DISTANCE_EPSILON,
		maxDistance: CAMERA_CONTROLS_CONSTANTS.FIRST_PERSON_DISTANCE_EPSILON,
		minPolarAngle: Math.PI / 2 - 1.35,
		maxPolarAngle: Math.PI / 2 + 1.35,
		smoothTime: 0.08,
		draggingSmoothTime: 0.035,
		azimuthRotateSpeed: 1.35,
		polarRotateSpeed: 0.75,
		dollySpeed: 0,
		truckSpeed: 0,
	},
	[CAMERA_MODE_IDS.FREE_ORBIT]: {
		minDistance: CAMERA_CONFIG.FREE_ORBITAL.MIN_DISTANCE,
		maxDistance: CAMERA_CONFIG.FREE_ORBITAL.MAX_DISTANCE,
		minPolarAngle: CAMERA_CONFIG.FREE_ORBITAL.MIN_POLAR_ANGLE,
		maxPolarAngle: CAMERA_CONFIG.FREE_ORBITAL.MAX_POLAR_ANGLE,
		smoothTime: 0.18,
		draggingSmoothTime: 0.08,
		azimuthRotateSpeed: CAMERA_CONFIG.FREE_ORBITAL.ROTATE_SPEED,
		polarRotateSpeed: CAMERA_CONFIG.FREE_ORBITAL.ROTATE_SPEED,
		dollySpeed: CAMERA_CONFIG.FREE_ORBITAL.ZOOM_SPEED,
		truckSpeed: CAMERA_CONFIG.FREE_ORBITAL.PAN_SPEED,
	},
} as const;
