import {
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useRef,
} from "react";

import { POINTER_ROLES } from "@/shared/config";
import { shouldBlockLookFromPointerTarget } from "@/shared/lib";
import { INPUT_EVENT_TYPES } from "../config";
import { resolveTouchLookDelta } from "../lib";
import type { InputOrchestratorEvent } from "./inputOrchestratorMachine";

type UseTouchLookInputInput = {
	readonly sendInput: (event: InputOrchestratorEvent) => void;
};

type PointerPosition = {
	readonly x: number;
	readonly y: number;
};

const createPointerPosition = (
	event: ReactPointerEvent<HTMLDivElement>,
): PointerPosition => ({
	x: event.clientX,
	y: event.clientY,
});

export const useTouchLookInput = ({ sendInput }: UseTouchLookInputInput) => {
	const activePointerIdRef = useRef<number | null>(null);
	const previousPositionRef = useRef<PointerPosition | null>(null);

	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			if (shouldBlockLookFromPointerTarget({ target: event.target })) {
				return;
			}

			event.preventDefault();

			activePointerIdRef.current = event.pointerId;
			previousPositionRef.current = createPointerPosition(event);
			event.currentTarget.setPointerCapture(event.pointerId);

			sendInput({
				type: INPUT_EVENT_TYPES.POINTER_OWNER_ASSIGNED,
				pointerId: event.pointerId,
				role: POINTER_ROLES.LOOK,
			});

			sendInput({
				type: INPUT_EVENT_TYPES.LOOK_POINTER_STARTED,
				pointerId: event.pointerId,
			});
		},
		[sendInput],
	);

	const handlePointerMove = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			if (activePointerIdRef.current !== event.pointerId) {
				return;
			}

			const previousPosition = previousPositionRef.current;

			if (!previousPosition) {
				return;
			}

			event.preventDefault();

			const currentPosition = createPointerPosition(event);
			const delta = resolveTouchLookDelta({
				current: currentPosition,
				previous: previousPosition,
				viewportHeight: window.innerHeight,
				viewportWidth: window.innerWidth,
			});

			previousPositionRef.current = currentPosition;

			sendInput({
				type: INPUT_EVENT_TYPES.LOOK_CHANGED,
				delta,
			});
		},
		[sendInput],
	);

	const stopLook = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			if (activePointerIdRef.current !== event.pointerId) {
				return;
			}

			event.preventDefault();

			if (event.currentTarget.hasPointerCapture(event.pointerId)) {
				event.currentTarget.releasePointerCapture(event.pointerId);
			}

			activePointerIdRef.current = null;
			previousPositionRef.current = null;

			sendInput({
				type: INPUT_EVENT_TYPES.POINTER_OWNER_RELEASED,
				pointerId: event.pointerId,
			});

			sendInput({
				type: INPUT_EVENT_TYPES.LOOK_STOPPED,
			});
		},
		[sendInput],
	);

	return {
		handlePointerDown,
		handlePointerMove,
		handlePointerUp: stopLook,
		handlePointerCancel: stopLook,
	};
};
