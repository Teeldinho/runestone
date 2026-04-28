export type {
	JoystickVectorResult,
	ResolveJoystickVectorInput,
} from "./resolveJoystickVector";
export { resolveJoystickVector } from "./resolveJoystickVector";
export type { ShouldEmitTouchJoystickVelocityInput } from "./shouldEmitTouchJoystickVelocity";
export { shouldEmitTouchJoystickVelocity } from "./shouldEmitTouchJoystickVelocity";
export { resolveTouchJoystickPointerAction } from "./touchJoystickPointerLifecycle";
export {
	type ResolveTouchJoystickVectorFromPointerInput,
	resolveTouchJoystickVectorFromPointer,
	type ShouldHandleTouchJoystickPointerActionInput,
	shouldHandleTouchJoystickPointerAction,
	type TouchJoystickBounds,
} from "./touchJoystickRuntime";
