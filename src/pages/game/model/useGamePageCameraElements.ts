import { useCallback, useState } from "react";

export const useGamePageCameraElements = () => {
	const [firstPersonLookElement, setFirstPersonLookElement] =
		useState<HTMLElement | null>(null);
	const firstPersonLookRef = useCallback((node: HTMLElement | null) => {
		setFirstPersonLookElement(node);
	}, []);

	const [cameraControlElement, setCameraControlElement] =
		useState<HTMLElement | null>(null);
	const cameraControlRef = useCallback((node: HTMLElement | null) => {
		setCameraControlElement(node);
	}, []);

	return {
		cameraControlElement,
		cameraControlRef,
		firstPersonLookElement,
		firstPersonLookRef,
	};
};
