import type { CameraRigOrbitBindings } from "../model/cameraRigViewModelTypes";

type CreateCameraRigOrbitBindingsInput = {
	cameraControlElement?: HTMLElement | null;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
};

export const createCameraRigOrbitBindings = ({
	cameraControlElement,
	handleOrbitEnd,
	handleOrbitStart,
}: CreateCameraRigOrbitBindingsInput): CameraRigOrbitBindings => ({
	cameraControlElement,
	handleOrbitEnd,
	handleOrbitStart,
});
