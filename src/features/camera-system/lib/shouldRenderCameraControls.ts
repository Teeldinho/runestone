type ShouldRenderCameraControlsInput = {
	readonly cameraControlElement?: HTMLElement | null;
	readonly isDesktopLayout: boolean;
};

export const shouldRenderCameraControls = ({
	cameraControlElement,
	isDesktopLayout,
}: ShouldRenderCameraControlsInput): boolean =>
	isDesktopLayout || cameraControlElement != null;

export type { ShouldRenderCameraControlsInput };
