import type { MutableRefObject, RefObject } from "react";
import { useCallback, useEffect } from "react";
import { CAMERA_RIG_MULTI_TOUCH_POINTER_COUNT } from "../config";
import {
	type OrbitControlsHandle,
	setOrbitRotationEnabled,
} from "../lib/cameraRigControls";

type UseCameraRigInteractionHandlersInput = {
	activeTouchPointerIdsRef: MutableRefObject<Set<number>>;
	cameraControlElement?: HTMLElement | null;
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	isTouchInitiallyOnLeftRef: MutableRefObject<boolean>;
	isUserInteractingRef: MutableRefObject<boolean>;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	topDownOrbitRef: RefObject<OrbitControlsHandle | null>;
};

type CameraRigInteractionHandlers = {
	handleFirstPersonLock: () => void;
	handleFirstPersonUnlock: () => void;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
};

export const useCameraRigInteractionHandlers = ({
	activeTouchPointerIdsRef,
	cameraControlElement,
	firstPersonOrbitRef,
	freeOrbitalOrbitRef,
	isTouchInitiallyOnLeftRef,
	isUserInteractingRef,
	thirdPersonOrbitRef,
	topDownOrbitRef,
}: UseCameraRigInteractionHandlersInput): CameraRigInteractionHandlers => {
	const handlePointerDown = useCallback(
		(event: PointerEvent) => {
			if (event.pointerType === "touch") {
				activeTouchPointerIdsRef.current.add(event.pointerId);
			}

			isTouchInitiallyOnLeftRef.current =
				event.clientX < window.innerWidth * 0.5;
		},
		[activeTouchPointerIdsRef, isTouchInitiallyOnLeftRef],
	);

	const handlePointerUp = useCallback(
		(event: PointerEvent) => {
			if (event.pointerType === "touch") {
				activeTouchPointerIdsRef.current.delete(event.pointerId);
			}
		},
		[activeTouchPointerIdsRef],
	);

	useEffect(() => {
		const element = cameraControlElement;
		if (!element) {
			return;
		}

		element.addEventListener("pointerdown", handlePointerDown);
		element.addEventListener("pointercancel", handlePointerUp);
		element.addEventListener("pointerup", handlePointerUp);
		return () => {
			element.removeEventListener("pointerdown", handlePointerDown);
			element.removeEventListener("pointercancel", handlePointerUp);
			element.removeEventListener("pointerup", handlePointerUp);
		};
	}, [cameraControlElement, handlePointerDown, handlePointerUp]);

	const handleFirstPersonLock = useCallback(() => {}, []);

	const handleFirstPersonUnlock = useCallback(() => {}, []);

	const handleOrbitStart = useCallback(() => {
		isUserInteractingRef.current = true;
		const isMultiTouchGesture =
			activeTouchPointerIdsRef.current.size >=
			CAMERA_RIG_MULTI_TOUCH_POINTER_COUNT;
		setOrbitRotationEnabled(
			[
				thirdPersonOrbitRef,
				topDownOrbitRef,
				freeOrbitalOrbitRef,
				firstPersonOrbitRef,
			],
			isMultiTouchGesture || !isTouchInitiallyOnLeftRef.current,
		);
	}, [
		activeTouchPointerIdsRef,
		firstPersonOrbitRef,
		freeOrbitalOrbitRef,
		isTouchInitiallyOnLeftRef,
		isUserInteractingRef,
		thirdPersonOrbitRef,
		topDownOrbitRef,
	]);

	const handleOrbitEnd = useCallback(() => {
		isUserInteractingRef.current = false;
		setOrbitRotationEnabled(
			[
				thirdPersonOrbitRef,
				topDownOrbitRef,
				freeOrbitalOrbitRef,
				firstPersonOrbitRef,
			],
			true,
		);
	}, [
		firstPersonOrbitRef,
		freeOrbitalOrbitRef,
		isUserInteractingRef,
		thirdPersonOrbitRef,
		topDownOrbitRef,
	]);

	return {
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		handleOrbitEnd,
		handleOrbitStart,
	};
};

export type {
	CameraRigInteractionHandlers,
	UseCameraRigInteractionHandlersInput,
};
