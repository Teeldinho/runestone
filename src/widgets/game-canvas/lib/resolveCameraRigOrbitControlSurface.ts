type ResolveCameraRigOrbitControlSurfaceInput = {
	readonly cameraControlElement?: HTMLElement | null;
	readonly isDesktopLayout: boolean;
};

export type CameraRigOrbitControlSurface = {
	readonly domElement?: HTMLElement;
	readonly shouldRenderOrbitControls: boolean;
};

export const resolveCameraRigOrbitControlSurface = ({
	cameraControlElement,
	isDesktopLayout,
}: ResolveCameraRigOrbitControlSurfaceInput): CameraRigOrbitControlSurface => {
	if (isDesktopLayout) {
		return {
			domElement: undefined,
			shouldRenderOrbitControls: true,
		};
	}

	if (!cameraControlElement) {
		return {
			domElement: undefined,
			shouldRenderOrbitControls: false,
		};
	}

	return {
		domElement: cameraControlElement,
		shouldRenderOrbitControls: true,
	};
};
