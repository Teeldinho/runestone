import {
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
} from "react";

import type { Vector3Tuple } from "@/shared/lib";

import {
	TOUCH_JOYSTICK_GLOBAL_RELEASE_EVENTS,
	TOUCH_JOYSTICK_GLOBAL_RELEASE_LISTENER_OPTIONS,
	TOUCH_JOYSTICK_POINTER_ACTIONS,
	TOUCH_JOYSTICK_POINTER_PHASES,
} from "../config";
import { shouldHandleTouchJoystickPointerAction } from "../lib";
import { useTouchJoystickMotion } from "./useTouchJoystickMotion";

type UseTouchJoystickInputOptions = {
	onMove: (velocity: Vector3Tuple) => void;
	onStop: () => void;
};

type UseTouchJoystickInputResult = {
	joystickRef: RefObject<HTMLDivElement | null>;
	knobOffsetX: number;
	knobOffsetY: number;
	isActive: boolean;
	handlePointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
	handlePointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
	handlePointerLostPointerCapture: (
		event: ReactPointerEvent<HTMLDivElement>,
	) => void;
	handlePointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
	handlePointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

const stopTouchControlPointerEvent = (
	event: ReactPointerEvent<HTMLDivElement>,
): void => {
	event.preventDefault();
	event.stopPropagation();
};

export const useTouchJoystickInput = ({
	onMove,
	onStop,
}: UseTouchJoystickInputOptions): UseTouchJoystickInputResult => {
	const activePointerIdRef = useRef<number | null>(null);
	const activePointerCaptureTargetRef = useRef<HTMLDivElement | null>(null);
	const {
		joystickRef,
		knobOffsetX,
		knobOffsetY,
		isActive,
		beginJoystickMotion,
		updateJoystickMotion,
		resetJoystickMotion,
	} = useTouchJoystickMotion({ onMove, onStop });

	const completeActiveJoystickMotion = useCallback(
		(shouldReleasePointerCapture: boolean) => {
			const activePointerId = activePointerIdRef.current;
			const activePointerCaptureTarget = activePointerCaptureTargetRef.current;

			if (activePointerId === null) {
				return;
			}

			activePointerIdRef.current = null;

			if (
				shouldReleasePointerCapture &&
				activePointerCaptureTarget?.hasPointerCapture(activePointerId)
			) {
				activePointerCaptureTarget.releasePointerCapture(activePointerId);
			}

			activePointerCaptureTargetRef.current = null;
			resetJoystickMotion();
		},
		[resetJoystickMotion],
	);

	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			stopTouchControlPointerEvent(event);

			if (
				!shouldHandleTouchJoystickPointerAction({
					activePointerId: activePointerIdRef.current,
					eventPointerId: event.pointerId,
					phase: TOUCH_JOYSTICK_POINTER_PHASES.DOWN,
					expectedAction: TOUCH_JOYSTICK_POINTER_ACTIONS.ACTIVATE,
				})
			) {
				return;
			}

			activePointerIdRef.current = event.pointerId;
			activePointerCaptureTargetRef.current =
				joystickRef.current ?? event.currentTarget;
			event.currentTarget.setPointerCapture(event.pointerId);
			beginJoystickMotion(event.clientX, event.clientY);
		},
		[beginJoystickMotion, joystickRef],
	);

	const handlePointerMove = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			stopTouchControlPointerEvent(event);

			if (
				!shouldHandleTouchJoystickPointerAction({
					activePointerId: activePointerIdRef.current,
					eventPointerId: event.pointerId,
					phase: TOUCH_JOYSTICK_POINTER_PHASES.MOVE,
					expectedAction: TOUCH_JOYSTICK_POINTER_ACTIONS.UPDATE,
				})
			) {
				return;
			}

			updateJoystickMotion(event.clientX, event.clientY);
		},
		[updateJoystickMotion],
	);

	const handlePointerRelease = useCallback(
		(
			event: ReactPointerEvent<HTMLDivElement>,
			phase: (typeof TOUCH_JOYSTICK_POINTER_PHASES)["UP" | "CANCEL"],
		) => {
			stopTouchControlPointerEvent(event);

			if (
				!shouldHandleTouchJoystickPointerAction({
					activePointerId: activePointerIdRef.current,
					eventPointerId: event.pointerId,
					phase,
					expectedAction: TOUCH_JOYSTICK_POINTER_ACTIONS.RELEASE,
				})
			) {
				return;
			}

			completeActiveJoystickMotion(true);
		},
		[completeActiveJoystickMotion],
	);

	const handlePointerLostPointerCapture = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			stopTouchControlPointerEvent(event);

			if (activePointerIdRef.current !== event.pointerId) {
				return;
			}

			completeActiveJoystickMotion(false);
		},
		[completeActiveJoystickMotion],
	);

	useEffect(() => {
		const handleGlobalPointerRelease = (event: PointerEvent) => {
			if (activePointerIdRef.current !== event.pointerId) {
				return;
			}

			completeActiveJoystickMotion(true);
		};

		const handleWindowBlur = () => {
			completeActiveJoystickMotion(false);
		};

		const handleDocumentVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				completeActiveJoystickMotion(false);
			}
		};

		window.addEventListener(
			TOUCH_JOYSTICK_GLOBAL_RELEASE_EVENTS.POINTER_UP,
			handleGlobalPointerRelease,
			TOUCH_JOYSTICK_GLOBAL_RELEASE_LISTENER_OPTIONS.CAPTURE,
		);
		window.addEventListener(
			TOUCH_JOYSTICK_GLOBAL_RELEASE_EVENTS.POINTER_CANCEL,
			handleGlobalPointerRelease,
			TOUCH_JOYSTICK_GLOBAL_RELEASE_LISTENER_OPTIONS.CAPTURE,
		);
		window.addEventListener("blur", handleWindowBlur);
		document.addEventListener(
			"visibilitychange",
			handleDocumentVisibilityChange,
		);

		return () => {
			window.removeEventListener(
				TOUCH_JOYSTICK_GLOBAL_RELEASE_EVENTS.POINTER_UP,
				handleGlobalPointerRelease,
				TOUCH_JOYSTICK_GLOBAL_RELEASE_LISTENER_OPTIONS.CAPTURE,
			);
			window.removeEventListener(
				TOUCH_JOYSTICK_GLOBAL_RELEASE_EVENTS.POINTER_CANCEL,
				handleGlobalPointerRelease,
				TOUCH_JOYSTICK_GLOBAL_RELEASE_LISTENER_OPTIONS.CAPTURE,
			);
			window.removeEventListener("blur", handleWindowBlur);
			document.removeEventListener(
				"visibilitychange",
				handleDocumentVisibilityChange,
			);
			completeActiveJoystickMotion(true);
		};
	}, [completeActiveJoystickMotion]);

	const handlePointerUp = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			handlePointerRelease(event, TOUCH_JOYSTICK_POINTER_PHASES.UP);
		},
		[handlePointerRelease],
	);

	const handlePointerCancel = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			handlePointerRelease(event, TOUCH_JOYSTICK_POINTER_PHASES.CANCEL);
		},
		[handlePointerRelease],
	);

	return {
		joystickRef,
		knobOffsetX,
		knobOffsetY,
		isActive,
		handlePointerDown,
		handlePointerMove,
		handlePointerLostPointerCapture,
		handlePointerUp,
		handlePointerCancel,
	};
};

export type { UseTouchJoystickInputOptions, UseTouchJoystickInputResult };
