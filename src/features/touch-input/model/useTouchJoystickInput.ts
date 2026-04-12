import {
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useCallback,
	useRef,
	useState,
} from "react";

import type { Vector3Tuple } from "@/shared/types";

import { TOUCH_JOYSTICK_CONFIG } from "../config";
import { resolveJoystickVector } from "../lib";

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

			const centerX = joystickBounds.left + joystickBounds.width / 2;
			const centerY = joystickBounds.top + joystickBounds.height / 2;
			const joystickVector = resolveJoystickVector({
				deltaX: clientX - centerX,
				deltaY: clientY - centerY,
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
			event.stopPropagation();
			event.preventDefault();

			if (activePointerIdRef.current !== null) {
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
			event.stopPropagation();
			event.preventDefault();

			if (event.pointerId !== activePointerIdRef.current) {
				return;
			}

			updateJoystickFromPointer(event.clientX, event.clientY);
		},
		[updateJoystickFromPointer],
	);

	const handlePointerUp = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			event.stopPropagation();
			event.preventDefault();

			if (event.pointerId !== activePointerIdRef.current) {
				return;
			}

			activePointerIdRef.current = null;
			resetJoystick();
		},
		[resetJoystick],
	);

	const handlePointerCancel = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			event.stopPropagation();
			event.preventDefault();

			if (event.pointerId !== activePointerIdRef.current) {
				return;
			}

			activePointerIdRef.current = null;
			resetJoystick();
		},
		[resetJoystick],
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
