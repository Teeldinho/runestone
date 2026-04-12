import { CAMERA_MODES } from "@/shared/config";

export type { CameraMode } from "@/shared/config";
export { CAMERA_MODES };

export const CAMERA_DEFAULT_MODE = CAMERA_MODES.THIRD_PERSON;

export const CAMERA_HOTKEYS = {
	THIRD_PERSON: "1",
	TOP_DOWN: "2",
	FIRST_PERSON: "3",
	FREE_ORBITAL: "4",
} as const;

export type CameraHotkey = (typeof CAMERA_HOTKEYS)[keyof typeof CAMERA_HOTKEYS];
