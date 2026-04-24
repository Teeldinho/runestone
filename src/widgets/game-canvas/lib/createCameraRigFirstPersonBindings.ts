import type { CameraRigFirstPersonBindings } from "../model/cameraRigViewModelTypes";

type CreateCameraRigFirstPersonBindingsInput = {
	firstPersonLookElement?: HTMLElement | null;
	handleFirstPersonLock: () => void;
	handleFirstPersonUnlock: () => void;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
};

export const createCameraRigFirstPersonBindings = ({
	firstPersonLookElement,
	handleFirstPersonLock,
	handleFirstPersonUnlock,
	handleOrbitEnd,
	handleOrbitStart,
}: CreateCameraRigFirstPersonBindingsInput): CameraRigFirstPersonBindings => ({
	firstPersonLookElement,
	handleFirstPersonLock,
	handleFirstPersonUnlock,
	handleOrbitEnd,
	handleOrbitStart,
});
