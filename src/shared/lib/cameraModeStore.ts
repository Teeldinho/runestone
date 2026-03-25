import { CAMERA_MODES } from "@/shared/config";

let currentCameraMode: string = CAMERA_MODES.FREE_ORBITAL;

export const getCameraMode = (): string => currentCameraMode;

export const setCameraMode = (mode: string): void => {
	currentCameraMode = mode;
};
