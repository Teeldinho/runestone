import type { HapticEventName } from "../config/hapticEvents";
import { THROTTLED_HAPTIC_EVENTS } from "../config/hapticThrottleConfig";

export const isHapticEventThrottled = (eventName: HapticEventName): boolean =>
	THROTTLED_HAPTIC_EVENTS.has(eventName);
