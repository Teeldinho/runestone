import {
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useCallback,
	useRef,
} from "react";

import type { Vector3Tuple } from "@/shared/lib";

import {
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
	const {
		joystickRef,
		knobOffsetX,
		knobOffsetY,
		isActive,
		beginJoystickMotion,
		updateJoystickMotion,
		resetJoystickMotion,
	} = useTouchJoystickMotion({ onMove, onStop });

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
			event.currentTarget.setPointerCapture(event.pointerId);
			beginJoystickMotion(event.clientX, event.clientY);
		},
		[beginJoystickMotion],
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

			if (event.currentTarget.hasPointerCapture(event.pointerId)) {
				event.currentTarget.releasePointerCapture(event.pointerId);
			}

			activePointerIdRef.current = null;
			resetJoystickMotion();
		},
		[resetJoystickMotion],
	);

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
		handlePointerUp,
		handlePointerCancel,
	};
};

export type { UseTouchJoystickInputOptions, UseTouchJoystickInputResult };
