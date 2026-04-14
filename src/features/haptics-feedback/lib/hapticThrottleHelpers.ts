import type { HapticEventName } from "../config/hapticEvents";
import { THROTTLED_HAPTIC_EVENT_LIST } from "../config/hapticThrottleConfig";

const THROTTLED_HAPTIC_EVENTS: ReadonlySet<HapticEventName> = new Set(
	THROTTLED_HAPTIC_EVENT_LIST,
);

export const isHapticEventThrottled = (eventName: HapticEventName): boolean =>
	THROTTLED_HAPTIC_EVENTS.has(eventName);
