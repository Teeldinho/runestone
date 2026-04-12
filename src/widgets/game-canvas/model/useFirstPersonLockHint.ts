import { useEffect, useState } from "react";

import { CAMERA_MODES } from "@/features/camera-system";
import { useResponsiveGameLayout } from "@/features/responsive-layout";

type UseFirstPersonLockHintInput = {
	mode: string | undefined;
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
		document.addEventListener("pointerlockchange", handlePointerLockChange);

		return () => {
			document.removeEventListener(
				"pointerlockchange",
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
