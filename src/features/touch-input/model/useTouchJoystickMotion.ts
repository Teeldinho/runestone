import { type RefObject, useCallback, useRef, useState } from "react";
import type { Vector3Tuple } from "@/shared/lib";

import { TOUCH_JOYSTICK_CONFIG } from "../config";
import {
	type ResolveTouchJoystickVectorFromPointerInput,
	resolveTouchJoystickVectorFromPointer,
	shouldEmitTouchJoystickVelocity,
} from "../lib";

type UseTouchJoystickMotionOptions = {
	onMove: (velocity: Vector3Tuple) => void;
	onStop: () => void;
};

type UseTouchJoystickMotionResult = {
	joystickRef: RefObject<HTMLDivElement | null>;
	knobOffsetX: number;
	knobOffsetY: number;
	isActive: boolean;
	beginJoystickMotion: (
		clientX: ResolveTouchJoystickVectorFromPointerInput["clientX"],
		clientY: ResolveTouchJoystickVectorFromPointerInput["clientY"],
	) => void;
	updateJoystickMotion: (
		clientX: ResolveTouchJoystickVectorFromPointerInput["clientX"],
		clientY: ResolveTouchJoystickVectorFromPointerInput["clientY"],
	) => void;
	resetJoystickMotion: () => void;
};

export const useTouchJoystickMotion = ({
	onMove,
	onStop,
}: UseTouchJoystickMotionOptions): UseTouchJoystickMotionResult => {
	const joystickRef = useRef<HTMLDivElement>(null);
	const [knobOffsetX, setKnobOffsetX] = useState(0);
	const [knobOffsetY, setKnobOffsetY] = useState(0);
	const [isActive, setIsActive] = useState(false);
	const previousVelocityRef = useRef<Vector3Tuple | null>(null);

	const resetJoystickMotion = useCallback(() => {
		setKnobOffsetX(0);
		setKnobOffsetY(0);
		setIsActive(false);
		previousVelocityRef.current = null;
		onStop();
	}, [onStop]);

	const updateJoystickMotion = useCallback(
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
				if (
					shouldEmitTouchJoystickVelocity({
						nextVelocity: joystickVector.velocity,
						previousVelocity: previousVelocityRef.current,
						threshold: TOUCH_JOYSTICK_CONFIG.VELOCITY_CHANGE_THRESHOLD,
					})
				) {
					previousVelocityRef.current = joystickVector.velocity;
					onMove(joystickVector.velocity);
				}

				return;
			}

			if (previousVelocityRef.current !== null) {
				previousVelocityRef.current = null;
				onStop();
			}
		},
		[onMove, onStop],
	);

	const beginJoystickMotion = useCallback(
		(clientX: number, clientY: number) => {
			setIsActive(true);
			updateJoystickMotion(clientX, clientY);
		},
		[updateJoystickMotion],
	);

	return {
		joystickRef,
		knobOffsetX,
		knobOffsetY,
		isActive,
		beginJoystickMotion,
		updateJoystickMotion,
		resetJoystickMotion,
	};
};

export type { UseTouchJoystickMotionOptions, UseTouchJoystickMotionResult };
