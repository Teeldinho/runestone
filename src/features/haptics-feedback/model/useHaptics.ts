import { useCallback, useMemo, useRef } from "react";
import { useWebHaptics } from "web-haptics/react";

import { HAPTIC_THROTTLE_MS } from "@/shared/config";

import {
	type HapticEventName,
	type HapticPattern,
	type HapticPatternKey,
	isHapticEventThrottled,
} from "../config";
import {
	createHapticEventHandlers,
	resolveHapticPatternForEvent,
	shouldSkipHapticTrigger,
} from "../lib";

const isHapticsDebugModeEnabled = import.meta.env.DEV;

export const useHaptics = () => {
	const { trigger, cancel, isSupported } = useWebHaptics({
		debug: isHapticsDebugModeEnabled,
	});
	const lastHapticTriggerAtRef = useRef(0);

	const triggerHapticPattern = useCallback(
		(pattern: HapticPattern, shouldThrottle: boolean) => {
			const now = Date.now();

			if (
				shouldSkipHapticTrigger({
					now,
					lastHapticTriggerAt: lastHapticTriggerAtRef.current,
					throttleMs: HAPTIC_THROTTLE_MS,
					shouldThrottle,
				})
			) {
				return;
			}

			lastHapticTriggerAtRef.current = now;
			void trigger(pattern);
		},
		[trigger],
	);

	const triggerHapticEvent = useCallback(
		(eventName: HapticEventName) => {
			triggerHapticPattern(
				resolveHapticPatternForEvent(eventName),
				isHapticEventThrottled(eventName),
			);
		},
		[triggerHapticPattern],
	);

	const hapticEventHandlers = useMemo(
		() => createHapticEventHandlers(triggerHapticEvent),
		[triggerHapticEvent],
	);

	const cancelHaptics = useCallback(() => {
		cancel();
	}, [cancel]);

	return {
		isHapticsSupported: isSupported,
		cancelHaptics,
		...hapticEventHandlers,
	};
};

export type { HapticPatternKey };
