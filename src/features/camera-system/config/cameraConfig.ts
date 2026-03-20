export const CAMERA_MODES = {
	THIRD_PERSON: "thirdPerson",
	TOP_DOWN: "topDown",
	FIRST_PERSON: "firstPerson",
	FREE_ORBITAL: "freeOrbital",
} as const;

export type CameraMode = (typeof CAMERA_MODES)[keyof typeof CAMERA_MODES];

export const CAMERA_HOTKEYS = {
	THIRD_PERSON: "1",
	TOP_DOWN: "2",
	FIRST_PERSON: "3",
	FREE_ORBITAL: "4",
} as const;

export type CameraHotkey = (typeof CAMERA_HOTKEYS)[keyof typeof CAMERA_HOTKEYS];
