export const CAMERA_EVENT_TYPES = {
	LOOK_CHANGED: "camera.input.look.changed",
	LOOK_STOPPED: "camera.input.look.stopped",
	ZOOM_CHANGED: "camera.input.zoom.changed",
	MODE_CHANGED: "camera.mode.changed",
	SWITCH_TO_THIRD_PERSON: "SWITCH_TO_THIRD_PERSON",
	SWITCH_TO_TOP_DOWN: "SWITCH_TO_TOP_DOWN",
	SWITCH_TO_FIRST_PERSON: "SWITCH_TO_FIRST_PERSON",
	SWITCH_TO_FREE_ORBITAL: "SWITCH_TO_FREE_ORBITAL",
	HOTKEY: "HOTKEY",
} as const;
