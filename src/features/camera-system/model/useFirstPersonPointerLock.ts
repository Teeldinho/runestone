import type CameraControlsImpl from "camera-controls";
import type { RefObject } from "react";
import { useEffect } from "react";

import { CAMERA_POINTER_LOCK_DOM_EVENTS, type CameraModeId } from "../config";
import { shouldEnableFirstPersonPointerLock } from "../lib";

type CameraControlsPointerLockHandle = CameraControlsImpl & {
	lockPointer?: () => void;
};

type UseFirstPersonPointerLockInput = {
	readonly controlsRef: RefObject<CameraControlsImpl | null>;
	readonly domElement: HTMLCanvasElement | null;
	readonly isDesktopLayout: boolean;
	readonly mode: CameraModeId;
};

export const useFirstPersonPointerLock = ({
	controlsRef,
	domElement,
	isDesktopLayout,
	mode,
}: UseFirstPersonPointerLockInput): void => {
	const shouldEnablePointerLock = shouldEnableFirstPersonPointerLock({
		isDesktopLayout,
		mode,
	});

	useEffect(() => {
		if (
			typeof document === "undefined" ||
			!domElement ||
			!shouldEnablePointerLock
		) {
			return;
		}

		const handlePointerDown = () => {
			const controls =
				controlsRef.current as CameraControlsPointerLockHandle | null;

			controls?.lockPointer?.();
		};

		domElement.addEventListener(
			CAMERA_POINTER_LOCK_DOM_EVENTS.POINTER_DOWN,
			handlePointerDown,
		);

		return () => {
			domElement.removeEventListener(
				CAMERA_POINTER_LOCK_DOM_EVENTS.POINTER_DOWN,
				handlePointerDown,
			);

			if (document.pointerLockElement === domElement) {
				document.exitPointerLock();
			}
		};
	}, [controlsRef, domElement, shouldEnablePointerLock]);
};

export type { UseFirstPersonPointerLockInput };
