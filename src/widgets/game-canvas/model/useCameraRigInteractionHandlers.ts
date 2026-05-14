import type { MutableRefObject } from "react";
import { useCallback } from "react";

type UseCameraRigInteractionHandlersInput = {
	isUserInteractingRef: MutableRefObject<boolean>;
};

type CameraRigInteractionHandlers = {
	handleFirstPersonLock: () => void;
	handleFirstPersonUnlock: () => void;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
};

export const useCameraRigInteractionHandlers = ({
	isUserInteractingRef,
}: UseCameraRigInteractionHandlersInput): CameraRigInteractionHandlers => {
	const handleFirstPersonLock = useCallback(() => {}, []);

	const handleFirstPersonUnlock = useCallback(() => {}, []);

	const handleOrbitStart = useCallback(() => {
		isUserInteractingRef.current = true;
	}, [isUserInteractingRef]);

	const handleOrbitEnd = useCallback(() => {
		isUserInteractingRef.current = false;
	}, [isUserInteractingRef]);

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
