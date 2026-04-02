import { CAMERA_MODES } from "@/shared/config";

let currentCameraMode: string = CAMERA_MODES.FREE_ORBITAL;
const cameraModeListeners = new Set<() => void>();

export const getCameraMode = (): string => currentCameraMode;

export const setCameraMode = (mode: string): void => {
	currentCameraMode = mode;
	cameraModeListeners.forEach((listener) => {
		listener();
	});
};

export const subscribeToCameraMode = (listener: () => void): (() => void) => {
	cameraModeListeners.add(listener);

	return () => {
		cameraModeListeners.delete(listener);
	};
};
