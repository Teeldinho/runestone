export const CAMERA_MODES = {
	THIRD_PERSON: "thirdPerson",
	TOP_DOWN: "topDown",
	FIRST_PERSON: "firstPerson",
	FREE_ORBITAL: "freeOrbital",
} as const;

export type CameraMode = (typeof CAMERA_MODES)[keyof typeof CAMERA_MODES];
