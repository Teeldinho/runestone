import type { CameraRigOrbitBindings } from "../model/cameraRigViewModelTypes";
import { resolveCameraRigOrbitControlSurface } from "./resolveCameraRigOrbitControlSurface";

type CreateCameraRigOrbitBindingsInput = {
	readonly cameraControlElement?: HTMLElement | null;
	readonly handleOrbitEnd: () => void;
	readonly handleOrbitStart: () => void;
	readonly isDesktopLayout: boolean;
};

export const createCameraRigOrbitBindings = ({
	cameraControlElement,
	handleOrbitEnd,
	handleOrbitStart,
	isDesktopLayout,
}: CreateCameraRigOrbitBindingsInput): CameraRigOrbitBindings => {
	const orbitControlSurface = resolveCameraRigOrbitControlSurface({
		cameraControlElement,
		isDesktopLayout,
	});

	return {
		domElement: orbitControlSurface.domElement,
		handleOrbitEnd,
		handleOrbitStart,
		shouldRenderOrbitControls: orbitControlSurface.shouldRenderOrbitControls,
	};
};
