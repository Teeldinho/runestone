import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
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

type PendingJoystickVisualState = {
	readonly knobOffsetX: number;
	readonly knobOffsetY: number;
};

export const useTouchJoystickMotion = ({
	onMove,
	onStop,
}: UseTouchJoystickMotionOptions): UseTouchJoystickMotionResult => {
	const joystickRef = useRef<HTMLDivElement>(null);
	const [knobOffsetX, setKnobOffsetX] = useState<number>(
		TOUCH_JOYSTICK_CONFIG.RESTING_KNOB_OFFSET_PX,
	);
	const [knobOffsetY, setKnobOffsetY] = useState<number>(
		TOUCH_JOYSTICK_CONFIG.RESTING_KNOB_OFFSET_PX,
	);
	const [isActive, setIsActive] = useState(false);

	const previousVelocityRef = useRef<Vector3Tuple | null>(null);
	const pendingJoystickVisualStateRef =
		useRef<PendingJoystickVisualState | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	const flushJoystickVisualState = useCallback(() => {
		const pendingJoystickVisualState = pendingJoystickVisualStateRef.current;

		if (!pendingJoystickVisualState) {
			animationFrameRef.current = null;
			return;
		}

		setKnobOffsetX(pendingJoystickVisualState.knobOffsetX);
		setKnobOffsetY(pendingJoystickVisualState.knobOffsetY);

		pendingJoystickVisualStateRef.current = null;
		animationFrameRef.current = null;
	}, []);

	const scheduleJoystickVisualState = useCallback(
		(joystickVisualState: PendingJoystickVisualState) => {
			pendingJoystickVisualStateRef.current = joystickVisualState;

			if (animationFrameRef.current !== null) {
				return;
			}

			animationFrameRef.current = requestAnimationFrame(
				flushJoystickVisualState,
			);
		},
		[flushJoystickVisualState],
	);

	const cancelPendingJoystickVisualState = useCallback(() => {
		if (animationFrameRef.current !== null) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}

		pendingJoystickVisualStateRef.current = null;
	}, []);

	const resetJoystickMotion = useCallback(() => {
		cancelPendingJoystickVisualState();

		setKnobOffsetX(TOUCH_JOYSTICK_CONFIG.RESTING_KNOB_OFFSET_PX);
		setKnobOffsetY(TOUCH_JOYSTICK_CONFIG.RESTING_KNOB_OFFSET_PX);
		setIsActive(false);

		previousVelocityRef.current = null;
		onStop();
	}, [cancelPendingJoystickVisualState, onStop]);

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

			scheduleJoystickVisualState({
				knobOffsetX: joystickVector.knobOffsetX,
				knobOffsetY: joystickVector.knobOffsetY,
			});

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
		[onMove, onStop, scheduleJoystickVisualState],
	);

	const beginJoystickMotion = useCallback(
		(clientX: number, clientY: number) => {
			setIsActive(true);
			updateJoystickMotion(clientX, clientY);
		},
		[updateJoystickMotion],
	);

	useEffect(() => {
		return () => {
			cancelPendingJoystickVisualState();
		};
	}, [cancelPendingJoystickVisualState]);

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
