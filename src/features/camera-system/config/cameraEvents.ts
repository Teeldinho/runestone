import type { CameraHotkey } from "./cameraConfig";

export const CAMERA_EVENTS = {
	SWITCH_TO_THIRD_PERSON: "SWITCH_TO_THIRD_PERSON",
	SWITCH_TO_TOP_DOWN: "SWITCH_TO_TOP_DOWN",
	SWITCH_TO_FIRST_PERSON: "SWITCH_TO_FIRST_PERSON",
	SWITCH_TO_FREE_ORBITAL: "SWITCH_TO_FREE_ORBITAL",
	HOTKEY: "HOTKEY",
} as const;

export type CameraEvent = (typeof CAMERA_EVENTS)[keyof typeof CAMERA_EVENTS];

export type CameraEventObject =
	| {
			type: typeof CAMERA_EVENTS.SWITCH_TO_THIRD_PERSON;
	  }
	| {
			type: typeof CAMERA_EVENTS.SWITCH_TO_TOP_DOWN;
	  }
	| {
			type: typeof CAMERA_EVENTS.SWITCH_TO_FIRST_PERSON;
	  }
	| {
			type: typeof CAMERA_EVENTS.SWITCH_TO_FREE_ORBITAL;
	  }
	| {
			type: typeof CAMERA_EVENTS.HOTKEY;
			hotkey: CameraHotkey;
	  };
