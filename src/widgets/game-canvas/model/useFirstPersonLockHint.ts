import { useEffect, useState } from "react";

import {
	CAMERA_MODES,
	CAMERA_POINTER_LOCK_DOM_EVENTS,
	type CameraMode,
} from "@/features/camera-system";
import { useResponsiveGameLayout } from "@/features/responsive-layout";

type UseFirstPersonLockHintInput = {
	mode: CameraMode | undefined;
};

const getPointerLockActive = (): boolean => {
	if (typeof document === "undefined") {
		return false;
	}

	return document.pointerLockElement !== null;
};

export const useFirstPersonLockHint = ({
	mode,
}: UseFirstPersonLockHintInput): boolean => {
	const [isPointerLockActive, setIsPointerLockActive] =
		useState(getPointerLockActive);
	const { isDesktopLayout } = useResponsiveGameLayout();

	useEffect(() => {
		const handlePointerLockChange = () => {
			setIsPointerLockActive(getPointerLockActive());
		};

		handlePointerLockChange();
		document.addEventListener(
			CAMERA_POINTER_LOCK_DOM_EVENTS.POINTER_LOCK_CHANGE,
			handlePointerLockChange,
		);

		return () => {
			document.removeEventListener(
				CAMERA_POINTER_LOCK_DOM_EVENTS.POINTER_LOCK_CHANGE,
				handlePointerLockChange,
			);
		};
	}, []);

	return (
		mode === CAMERA_MODES.FIRST_PERSON &&
		!isPointerLockActive &&
		isDesktopLayout
	);
};

export type { UseFirstPersonLockHintInput };
