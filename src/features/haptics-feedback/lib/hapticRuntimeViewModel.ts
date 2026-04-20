import {
	HAPTIC_EVENT_NAMES,
	HAPTIC_EVENT_PATTERN_KEYS,
	HAPTIC_PATTERNS,
	type HapticEventName,
	type HapticPattern,
} from "../config";

type ShouldSkipHapticTriggerInput = {
	now: number;
	lastHapticTriggerAt: number;
	throttleMs: number;
	shouldThrottle: boolean;
};

type HapticEventHandlers = Record<HapticEventName, () => void>;

const shouldSkipHapticTrigger = ({
	now,
	lastHapticTriggerAt,
	throttleMs,
	shouldThrottle,
}: ShouldSkipHapticTriggerInput): boolean => {
	if (!shouldThrottle) {
		return false;
	}

	return now - lastHapticTriggerAt < throttleMs;
};

const resolveHapticPatternForEvent = (
	eventName: HapticEventName,
): HapticPattern => {
	const hapticPatternKey = HAPTIC_EVENT_PATTERN_KEYS[eventName];

	return HAPTIC_PATTERNS[hapticPatternKey] as HapticPattern;
};

const createHapticEventHandlers = (
	triggerHapticEvent: (eventName: HapticEventName) => void,
): HapticEventHandlers => ({
	[HAPTIC_EVENT_NAMES.ON_ROOM_ENTER]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_ROOM_ENTER),
	[HAPTIC_EVENT_NAMES.ON_GUARD_SUCCESS]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_GUARD_SUCCESS),
	[HAPTIC_EVENT_NAMES.ON_GUARD_FAIL]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_GUARD_FAIL),
	[HAPTIC_EVENT_NAMES.ON_ENEMY_HIT]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_ENEMY_HIT),
	[HAPTIC_EVENT_NAMES.ON_PLAYER_DEATH]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_PLAYER_DEATH),
	[HAPTIC_EVENT_NAMES.ON_KEY_PICKUP]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_KEY_PICKUP),
	[HAPTIC_EVENT_NAMES.ON_CAMERA_SWITCH]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_CAMERA_SWITCH),
	[HAPTIC_EVENT_NAMES.ON_TRANSITION]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_TRANSITION),
	[HAPTIC_EVENT_NAMES.ON_ACHIEVEMENT]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_ACHIEVEMENT),
	[HAPTIC_EVENT_NAMES.ON_FLOOR_COMPLETE]: () =>
		triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_FLOOR_COMPLETE),
});

export type { HapticEventHandlers, ShouldSkipHapticTriggerInput };
export {
	createHapticEventHandlers,
	resolveHapticPatternForEvent,
	shouldSkipHapticTrigger,
};
