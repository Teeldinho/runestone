import { useCallback, useRef } from "react";
import { useWebHaptics } from "web-haptics/react";

import { HAPTIC_THROTTLE_MS } from "@/shared/config";

import {
	HAPTIC_EVENT_NAMES,
	HAPTIC_EVENT_PATTERN_KEYS,
	HAPTIC_PATTERNS,
	type HapticEventName,
	type HapticPattern,
	type HapticPatternKey,
	isHapticEventThrottled,
} from "../config";

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
				shouldThrottle &&
				now - lastHapticTriggerAtRef.current < HAPTIC_THROTTLE_MS
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
			const hapticPatternKey = HAPTIC_EVENT_PATTERN_KEYS[eventName];
			const hapticPattern = HAPTIC_PATTERNS[hapticPatternKey] as HapticPattern;

			triggerHapticPattern(hapticPattern, isHapticEventThrottled(eventName));
		},
		[triggerHapticPattern],
	);

	const onRoomEnter = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_ROOM_ENTER),
		[triggerHapticEvent],
	);
	const onGuardSuccess = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_GUARD_SUCCESS),
		[triggerHapticEvent],
	);
	const onGuardFail = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_GUARD_FAIL),
		[triggerHapticEvent],
	);
	const onEnemyHit = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_ENEMY_HIT),
		[triggerHapticEvent],
	);
	const onPlayerDeath = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_PLAYER_DEATH),
		[triggerHapticEvent],
	);
	const onKeyPickup = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_KEY_PICKUP),
		[triggerHapticEvent],
	);
	const onCameraSwitch = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_CAMERA_SWITCH),
		[triggerHapticEvent],
	);
	const onTransition = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_TRANSITION),
		[triggerHapticEvent],
	);
	const onAchievement = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_ACHIEVEMENT),
		[triggerHapticEvent],
	);
	const onFloorComplete = useCallback(
		() => triggerHapticEvent(HAPTIC_EVENT_NAMES.ON_FLOOR_COMPLETE),
		[triggerHapticEvent],
	);

	const cancelHaptics = useCallback(() => {
		cancel();
	}, [cancel]);

	return {
		isHapticsSupported: isSupported,
		cancelHaptics,
		onRoomEnter,
		onGuardSuccess,
		onGuardFail,
		onEnemyHit,
		onPlayerDeath,
		onKeyPickup,
		onCameraSwitch,
		onTransition,
		onAchievement,
		onFloorComplete,
	};
};

export type { HapticPatternKey };
