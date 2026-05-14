import { TOUCH_LOOK_CONFIG } from "../config";
import type { InputVector2 } from "../model/inputOrchestratorMachine";

type TouchLookPointerPosition = {
	readonly x: number;
	readonly y: number;
};

type ResolveTouchLookDeltaInput = {
	readonly current: TouchLookPointerPosition;
	readonly previous: TouchLookPointerPosition;
	readonly viewportHeight: number;
	readonly viewportWidth: number;
};

const resolveSafeViewportSize = (size: number): number =>
	Math.max(size, TOUCH_LOOK_CONFIG.MIN_VIEWPORT_SIZE_PX);

export const resolveTouchLookDelta = ({
	current,
	previous,
	viewportHeight,
	viewportWidth,
}: ResolveTouchLookDeltaInput): InputVector2 => {
	const safeViewportWidth = resolveSafeViewportSize(viewportWidth);
	const safeViewportHeight = resolveSafeViewportSize(viewportHeight);

	const deltaX = current.x - previous.x;
	const deltaY = current.y - previous.y;

	return {
		x:
			(deltaX / safeViewportWidth) *
			TOUCH_LOOK_CONFIG.YAW_RADIANS_PER_FULL_VIEWPORT_DRAG,
		y:
			(deltaY / safeViewportHeight) *
			TOUCH_LOOK_CONFIG.PITCH_RADIANS_PER_FULL_VIEWPORT_DRAG,
	};
};

export type { ResolveTouchLookDeltaInput, TouchLookPointerPosition };
