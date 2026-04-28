import type { MutableRefObject, RefObject } from "react";
import { useCallback, useEffect } from "react";

import { type OrbitControlsHandle, setOrbitRotationEnabled } from "../lib";

type UseCameraRigInteractionHandlersInput = {
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
			isTouchInitiallyOnLeftRef.current =
				event.clientX < window.innerWidth * 0.5;
		},
		[isTouchInitiallyOnLeftRef],
	);

	useEffect(() => {
		const element = cameraControlElement;
		if (!element) {
			return;
		}

		element.addEventListener("pointerdown", handlePointerDown);
		return () => {
			element.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [cameraControlElement, handlePointerDown]);

	const handleFirstPersonLock = useCallback(() => {}, []);

	const handleFirstPersonUnlock = useCallback(() => {}, []);

	const handleOrbitStart = useCallback(() => {
		isUserInteractingRef.current = true;
		setOrbitRotationEnabled(
			[
				thirdPersonOrbitRef,
				topDownOrbitRef,
				freeOrbitalOrbitRef,
				firstPersonOrbitRef,
			],
			!isTouchInitiallyOnLeftRef.current,
		);
	}, [
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
