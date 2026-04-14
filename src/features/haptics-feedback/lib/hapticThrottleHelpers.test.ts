import { describe, expect, it } from "vitest";
import { HAPTIC_EVENT_NAMES } from "../config/hapticEvents";
import { isHapticEventThrottled } from "./hapticThrottleHelpers";

describe("isHapticEventThrottled", () => {
	it("returns true for throttled events", () => {
		expect(isHapticEventThrottled(HAPTIC_EVENT_NAMES.ON_ROOM_ENTER)).toBe(true);
		expect(isHapticEventThrottled(HAPTIC_EVENT_NAMES.ON_GUARD_SUCCESS)).toBe(
			true,
		);
		expect(isHapticEventThrottled(HAPTIC_EVENT_NAMES.ON_ENEMY_HIT)).toBe(true);
	});

	it("returns false for non-throttled events", () => {
		expect(isHapticEventThrottled(HAPTIC_EVENT_NAMES.ON_PLAYER_DEATH)).toBe(
			false,
		);
		expect(isHapticEventThrottled(HAPTIC_EVENT_NAMES.ON_ACHIEVEMENT)).toBe(
			false,
		);
		expect(isHapticEventThrottled(HAPTIC_EVENT_NAMES.ON_FLOOR_COMPLETE)).toBe(
			false,
		);
	});
});
