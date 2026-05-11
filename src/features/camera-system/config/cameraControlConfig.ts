import { CAMERA_MODES } from "@/shared/config";

export const CAMERA_MODE_IDS = {
	THIRD_PERSON: CAMERA_MODES.THIRD_PERSON,
	TOP_DOWN: CAMERA_MODES.TOP_DOWN,
	FIRST_PERSON: CAMERA_MODES.FIRST_PERSON,
	FREE_ORBIT: CAMERA_MODES.FREE_ORBITAL,
} as const;

export type CameraModeId =
	(typeof CAMERA_MODE_IDS)[keyof typeof CAMERA_MODE_IDS];

export const CAMERA_EVENT_TYPES = {
	LOOK_CHANGED: "camera.input.look.changed",
	LOOK_STOPPED: "camera.input.look.stopped",
	ZOOM_CHANGED: "camera.input.zoom.changed",
	MODE_CHANGED: "camera.mode.changed",
} as const;

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

	TOP_DOWN_POLAR_ANGLE: Math.PI * 0.08,

	MIN_DISTANCE: 3.5,
	MAX_DISTANCE: 12,
	DEFAULT_DISTANCE: 6,
	ZOOM_STEP: 0.6,

	TOUCH_LOOK_SENSITIVITY_X: 0.004,
	TOUCH_LOOK_SENSITIVITY_Y: 0.003,
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
		enableRotate: false,
		enablePan: false,
		enableZoom: false,
	},
	[CAMERA_MODE_IDS.FREE_ORBIT]: {
		enableRotate: true,
		enablePan: true,
		enableZoom: true,
	},
} as const;
