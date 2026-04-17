import type { MutableRefObject, RefObject } from "react";
import { useCallback, useEffect, useMemo } from "react";

import type { OrbitControlsHandle } from "../lib";

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

const setOrbitRotationEnabled = (
	orbitRefs: Array<RefObject<OrbitControlsHandle | null>>,
	enableRotate: boolean,
): void => {
	orbitRefs.forEach((orbitRef) => {
		if (orbitRef.current) {
			orbitRef.current.enableRotate = enableRotate;
		}
	});
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
	const orbitRefs = useMemo(
		() => [
			thirdPersonOrbitRef,
			topDownOrbitRef,
			freeOrbitalOrbitRef,
			firstPersonOrbitRef,
		],
		[
			firstPersonOrbitRef,
			freeOrbitalOrbitRef,
			thirdPersonOrbitRef,
			topDownOrbitRef,
		],
	);

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
		setOrbitRotationEnabled(orbitRefs, !isTouchInitiallyOnLeftRef.current);
	}, [isTouchInitiallyOnLeftRef, isUserInteractingRef, orbitRefs]);

	const handleOrbitEnd = useCallback(() => {
		isUserInteractingRef.current = false;
		setOrbitRotationEnabled(orbitRefs, true);
	}, [isUserInteractingRef, orbitRefs]);

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
