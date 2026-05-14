type ShouldRenderOrbitControlsInput = {
	readonly cameraControlElement?: HTMLElement | null;
	readonly isDesktopLayout: boolean;
};

export const shouldRenderOrbitControls = ({
	cameraControlElement,
	isDesktopLayout,
}: ShouldRenderOrbitControlsInput): boolean =>
	isDesktopLayout || cameraControlElement != null;

export type { ShouldRenderOrbitControlsInput };
