import { CAMERA_MODES } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

export { CAMERA_EVENT_TYPES } from "@/shared/config";

export const CAMERA_MODE_IDS = {
	THIRD_PERSON: CAMERA_MODES.THIRD_PERSON,
	TOP_DOWN: CAMERA_MODES.TOP_DOWN,
	FIRST_PERSON: CAMERA_MODES.FIRST_PERSON,
	FREE_ORBIT: CAMERA_MODES.FREE_ORBITAL,
} as const;

export type CameraModeId =
	(typeof CAMERA_MODE_IDS)[keyof typeof CAMERA_MODE_IDS];

export const CAMERA_ACTION_KEYS = {
	ASSIGN_LOOK_DELTA: "camera.action.assignLookDelta",
	CLEAR_LOOK_DELTA: "camera.action.clearLookDelta",
	ASSIGN_ZOOM_DELTA: "camera.action.assignZoomDelta",
	ASSIGN_MODE: "camera.action.assignMode",
} as const;

export const CAMERA_STATE_KEYS = {
	ACTIVE: "active",
} as const;

export const CAMERA_LIMITS = {
	THIRD_PERSON_MIN_POLAR_ANGLE: Math.PI * 0.2,
	THIRD_PERSON_MAX_POLAR_ANGLE: Math.PI * 0.48,

	FREE_ORBIT_MIN_POLAR_ANGLE: Math.PI * 0.12,
	FREE_ORBIT_MAX_POLAR_ANGLE: Math.PI * 0.82,

	FIRST_PERSON_MIN_POLAR_ANGLE: Math.PI / 2 - 1.35,
	FIRST_PERSON_MAX_POLAR_ANGLE: Math.PI / 2 + 1.35,
	FIRST_PERSON_ORBIT_DISTANCE: 1,

	TOP_DOWN_POLAR_ANGLE: Math.PI * 0.08,

	MIN_DISTANCE: 3.5,
	MAX_DISTANCE: 12,
	DEFAULT_DISTANCE: 6,
	ZOOM_STEP: 0.6,
	FOV_EPSILON: 0.01,
	ORBIT_CONTROLS_DIFF_EPSILON: 0.0001,
} as const;

export const CAMERA_LOOK_LIMITS = {
	MIN_PITCH: -1.35,
	MAX_PITCH: 1.35,
	DEFAULT_YAW: 0,
	DEFAULT_PITCH: 0,
} as const;

export const CAMERA_LOOK_CONFIG = {
	YAW_DIRECTION_MULTIPLIER: -1,
	PITCH_DIRECTION_MULTIPLIER: -1,
} as const;

export const ORBIT_CONTROL_MODE_POLICY = {
	[CAMERA_MODE_IDS.THIRD_PERSON]: {
		enableRotate: true,
		enablePan: false,
		enableZoom: true,
	},
	[CAMERA_MODE_IDS.TOP_DOWN]: {
		enableRotate: false,
		enablePan: false,
		enableZoom: true,
	},
	[CAMERA_MODE_IDS.FIRST_PERSON]: {
		enableRotate: true,
		enablePan: false,
		enableZoom: false,
	},
	[CAMERA_MODE_IDS.FREE_ORBIT]: {
		enableRotate: true,
		enablePan: true,
		enableZoom: true,
	},
} as const;

export const ORBIT_CONTROL_TOUCH_GESTURES = {
	[CAMERA_MODE_IDS.THIRD_PERSON]: {
		ONE: 0,
		TWO: 2,
	},
	[CAMERA_MODE_IDS.TOP_DOWN]: {
		ONE: 1,
		TWO: 2,
	},
	[CAMERA_MODE_IDS.FIRST_PERSON]: {
		ONE: 0,
		TWO: 2,
	},
	[CAMERA_MODE_IDS.FREE_ORBIT]: {
		ONE: 0,
		TWO: 2,
	},
} as const;

export const CAMERA_UP_VECTORS = {
	DEFAULT: [0, 1, 0] as Vector3Tuple,
	TOP_DOWN: [0, 0, 1] as Vector3Tuple,
} as const;
