import { describe, expect, it, vi } from "vitest";

import { HAPTIC_THROTTLE_MS } from "@/shared/config";

import { HAPTIC_EVENT_NAMES, HAPTIC_PATTERNS } from "../config";
import {
	createHapticEventHandlers,
	resolveHapticPatternForEvent,
	shouldSkipHapticTrigger,
} from "./hapticRuntimeViewModel";

describe("hapticRuntimeViewModel", () => {
	it("resolves configured haptic pattern by event name", () => {
		expect(resolveHapticPatternForEvent(HAPTIC_EVENT_NAMES.ON_ROOM_ENTER)).toBe(
			HAPTIC_PATTERNS.ROOM_ENTER,
		);
		expect(resolveHapticPatternForEvent(HAPTIC_EVENT_NAMES.ON_ENEMY_HIT)).toBe(
			HAPTIC_PATTERNS.ENEMY_HIT,
		);
		expect(
			resolveHapticPatternForEvent(HAPTIC_EVENT_NAMES.ON_FLOOR_COMPLETE),
		).toBe(HAPTIC_PATTERNS.FLOOR_COMPLETE);
	});

	it("skips trigger only while throttle window is active", () => {
		expect(
			shouldSkipHapticTrigger({
				now: 1000,
				lastHapticTriggerAt: 900,
				throttleMs: HAPTIC_THROTTLE_MS,
				shouldThrottle: false,
			}),
		).toBe(false);
		expect(
			shouldSkipHapticTrigger({
				now: 1000,
				lastHapticTriggerAt: 951,
				throttleMs: HAPTIC_THROTTLE_MS,
				shouldThrottle: true,
			}),
		).toBe(true);
		expect(
			shouldSkipHapticTrigger({
				now: 1000 + HAPTIC_THROTTLE_MS,
				lastHapticTriggerAt: 1000,
				throttleMs: HAPTIC_THROTTLE_MS,
				shouldThrottle: true,
			}),
		).toBe(false);
	});

	it("builds event handlers that dispatch their mapped event", () => {
		const triggerHapticEvent = vi.fn();
		const hapticEventHandlers = createHapticEventHandlers(triggerHapticEvent);

		hapticEventHandlers.onRoomEnter();
		hapticEventHandlers.onEnemyHit();
		hapticEventHandlers.onFloorComplete();

		expect(triggerHapticEvent).toHaveBeenNthCalledWith(
			1,
			HAPTIC_EVENT_NAMES.ON_ROOM_ENTER,
		);
		expect(triggerHapticEvent).toHaveBeenNthCalledWith(
			2,
			HAPTIC_EVENT_NAMES.ON_ENEMY_HIT,
		);
		expect(triggerHapticEvent).toHaveBeenNthCalledWith(
			3,
			HAPTIC_EVENT_NAMES.ON_FLOOR_COMPLETE,
		);
	});
});
