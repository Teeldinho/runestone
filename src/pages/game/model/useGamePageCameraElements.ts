import { useCallback, useState } from "react";

export const useGamePageCameraElements = () => {
	const [cameraControlElement, setCameraControlElement] =
		useState<HTMLElement | null>(null);
	const cameraControlRef = useCallback((node: HTMLElement | null) => {
		setCameraControlElement(node);
	}, []);

	return {
		cameraControlElement,
		cameraControlRef,
	};
};
