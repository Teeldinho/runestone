import {
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useCallback,
	useRef,
	useState,
} from "react";

import type { Vector3Tuple } from "@/shared/lib";

import {
	TOUCH_JOYSTICK_CONFIG,
	TOUCH_JOYSTICK_POINTER_ACTIONS,
	TOUCH_JOYSTICK_POINTER_PHASES,
} from "../config";
import {
	resolveTouchJoystickVectorFromPointer,
	shouldHandleTouchJoystickPointerAction,
} from "../lib";

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

export const useTouchJoystickInput = ({
	onMove,
	onStop,
}: UseTouchJoystickInputOptions): UseTouchJoystickInputResult => {
	const joystickRef = useRef<HTMLDivElement>(null);
	const activePointerIdRef = useRef<number | null>(null);
	const [knobOffsetX, setKnobOffsetX] = useState(0);
	const [knobOffsetY, setKnobOffsetY] = useState(0);
	const [isActive, setIsActive] = useState(false);

	const resetJoystick = useCallback(() => {
		setKnobOffsetX(0);
		setKnobOffsetY(0);
		setIsActive(false);
		onStop();
	}, [onStop]);

	const updateJoystickFromPointer = useCallback(
		(clientX: number, clientY: number) => {
			const joystickBounds = joystickRef.current?.getBoundingClientRect();

			if (!joystickBounds) {
				return;
			}

			const joystickVector = resolveTouchJoystickVectorFromPointer({
				clientX,
				clientY,
				joystickBounds,
				maxRadiusPx: TOUCH_JOYSTICK_CONFIG.MAX_RADIUS_PX,
				deadZoneRatio: TOUCH_JOYSTICK_CONFIG.DEAD_ZONE_RATIO,
			});

			setKnobOffsetX(joystickVector.knobOffsetX);
			setKnobOffsetY(joystickVector.knobOffsetY);

			if (joystickVector.hasMovement) {
				onMove(joystickVector.velocity);
			} else {
				onStop();
			}
		},
		[onMove, onStop],
	);

	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			event.preventDefault();
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
			setIsActive(true);
			updateJoystickFromPointer(event.clientX, event.clientY);
		},
		[updateJoystickFromPointer],
	);

	const handlePointerMove = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			event.preventDefault();
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

			updateJoystickFromPointer(event.clientX, event.clientY);
		},
		[updateJoystickFromPointer],
	);

	const handlePointerRelease = useCallback(
		(
			event: ReactPointerEvent<HTMLDivElement>,
			phase: (typeof TOUCH_JOYSTICK_POINTER_PHASES)["UP" | "CANCEL"],
		) => {
			event.preventDefault();
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

			activePointerIdRef.current = null;
			resetJoystick();
		},
		[resetJoystick],
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
