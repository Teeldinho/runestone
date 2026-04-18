import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

type CameraOrientationStoreState = {
	azimuth: number;
	setAzimuth: (azimuth: number) => void;
};

const createCameraOrientationStore = () =>
	createStore<CameraOrientationStoreState>()((set) => ({
		azimuth: 0,
		setAzimuth: (azimuth) => {
			set({ azimuth });
		},
	}));

const cameraOrientationStore = createCameraOrientationStore();

const selectCameraAzimuth = (state: CameraOrientationStoreState) =>
	state.azimuth;

export const useCameraAzimuthValue = (): number =>
	useStore(cameraOrientationStore, selectCameraAzimuth);

export const getCameraAzimuth = (): number =>
	selectCameraAzimuth(cameraOrientationStore.getState());

export const setCameraAzimuth = (azimuth: number): void => {
	cameraOrientationStore.getState().setAzimuth(azimuth);
};

export type { CameraOrientationStoreState };
