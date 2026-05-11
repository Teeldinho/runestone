import { useCallback, useRef } from "react";

import { POINTER_ROLES } from "@/shared/config";
import { shouldBlockLookFromPointerTarget } from "@/shared/lib";
import { INPUT_EVENT_TYPES, TOUCH_LOOK_CONFIG } from "../config";
import type {
	InputOrchestratorEvent,
	InputVector2,
} from "./inputOrchestratorMachine";

type UseTouchLookInputInput = {
	readonly sendInput: (event: InputOrchestratorEvent) => void;
};

type PointerPosition = {
	readonly x: number;
	readonly y: number;
};

const createPointerPosition = (
	event: PointerEvent | React.PointerEvent,
): PointerPosition => ({
	x: event.clientX,
	y: event.clientY,
});

const createLookDelta = ({
	current,
	previous,
}: {
	readonly current: PointerPosition;
	readonly previous: PointerPosition;
}): InputVector2 => ({
	x: (current.x - previous.x) * TOUCH_LOOK_CONFIG.SENSITIVITY_X,
	y: (current.y - previous.y) * TOUCH_LOOK_CONFIG.SENSITIVITY_Y,
});

export const useTouchLookInput = ({ sendInput }: UseTouchLookInputInput) => {
	const activePointerIdRef = useRef<number | null>(null);
	const previousPositionRef = useRef<PointerPosition | null>(null);

	const handlePointerDown = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
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
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (activePointerIdRef.current !== event.pointerId) {
				return;
			}

			const previousPosition = previousPositionRef.current;

			if (!previousPosition) {
				return;
			}

			event.preventDefault();

			const currentPosition = createPointerPosition(event);
			const delta = createLookDelta({
				current: currentPosition,
				previous: previousPosition,
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
		(event: React.PointerEvent<HTMLDivElement>) => {
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
