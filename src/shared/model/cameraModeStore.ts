import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import { CAMERA_MODES } from "@/shared/config";

type CameraModeStoreState = {
	mode: string;
	setMode: (mode: string) => void;
};

const createCameraModeStore = () =>
	createStore<CameraModeStoreState>()((set) => ({
		mode: CAMERA_MODES.FREE_ORBITAL,
		setMode: (mode) => {
			set({ mode });
		},
	}));

const cameraModeStore = createCameraModeStore();

const selectCameraMode = (state: CameraModeStoreState) => state.mode;

export const useCameraModeValue = (): string =>
	useStore(cameraModeStore, selectCameraMode);

export const getCameraMode = (): string =>
	selectCameraMode(cameraModeStore.getState());

export const setCameraMode = (mode: string): void => {
	cameraModeStore.getState().setMode(mode);
};

export const subscribeToCameraMode = (listener: () => void): (() => void) =>
	cameraModeStore.subscribe((state, previousState) => {
		if (state.mode !== previousState.mode) {
			listener();
		}
	});

export type { CameraModeStoreState };
