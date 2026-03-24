let currentCameraMode = "freeOrbital";

export const getCameraMode = (): string => currentCameraMode;

export const setCameraMode = (mode: string): void => {
	currentCameraMode = mode;
};
