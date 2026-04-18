import type {
	TouchJoystickPointerAction,
	TouchJoystickPointerPhase,
} from "../config";

import {
	type JoystickVectorResult,
	resolveJoystickVector,
} from "./resolveJoystickVector";
import { resolveTouchJoystickPointerAction } from "./touchJoystickPointerLifecycle";

type TouchJoystickBounds = Pick<DOMRect, "left" | "top" | "width" | "height">;

type ResolveTouchJoystickVectorFromPointerInput = {
	clientX: number;
	clientY: number;
	joystickBounds: TouchJoystickBounds;
	maxRadiusPx: number;
	deadZoneRatio: number;
};

type ShouldHandleTouchJoystickPointerActionInput = {
	activePointerId: number | null;
	eventPointerId: number;
	phase: TouchJoystickPointerPhase;
	expectedAction: TouchJoystickPointerAction;
};

const resolveTouchJoystickVectorFromPointer = ({
	clientX,
	clientY,
	joystickBounds,
	maxRadiusPx,
	deadZoneRatio,
}: ResolveTouchJoystickVectorFromPointerInput): JoystickVectorResult => {
	const centerX = joystickBounds.left + joystickBounds.width / 2;
	const centerY = joystickBounds.top + joystickBounds.height / 2;

	return resolveJoystickVector({
		deltaX: clientX - centerX,
		deltaY: clientY - centerY,
		maxRadiusPx,
		deadZoneRatio,
	});
};

const shouldHandleTouchJoystickPointerAction = ({
	activePointerId,
	eventPointerId,
	phase,
	expectedAction,
}: ShouldHandleTouchJoystickPointerActionInput): boolean => {
	return (
		resolveTouchJoystickPointerAction({
			activePointerId,
			eventPointerId,
			phase,
		}) === expectedAction
	);
};

export type {
	ResolveTouchJoystickVectorFromPointerInput,
	ShouldHandleTouchJoystickPointerActionInput,
	TouchJoystickBounds,
};
export {
	resolveTouchJoystickVectorFromPointer,
	shouldHandleTouchJoystickPointerAction,
};
