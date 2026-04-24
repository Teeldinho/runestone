// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HAPTIC_THROTTLE_MS } from "@/shared/config";
import { HAPTIC_PATTERNS, type HapticPatternKey } from "../config";

import { useHaptics } from "./useHaptics";

const { mockUseWebHaptics } = vi.hoisted(() => ({
	mockUseWebHaptics: vi.fn(),
}));

vi.mock("web-haptics/react", () => ({
	useWebHaptics: mockUseWebHaptics,
}));

const mockTrigger = vi.fn();
const mockCancel = vi.fn();

const HAPTIC_EVENT_CASES: Array<{
	eventHandlerName: keyof Pick<
		ReturnType<typeof useHaptics>,
		| "onRoomEnter"
		| "onGuardSuccess"
		| "onGuardFail"
		| "onEnemyHit"
		| "onPlayerDeath"
		| "onKeyPickup"
		| "onCameraSwitch"
		| "onTransition"
		| "onAchievement"
		| "onFloorComplete"
	>;
	patternKey: HapticPatternKey;
}> = [
	{ eventHandlerName: "onRoomEnter", patternKey: "ROOM_ENTER" },
	{ eventHandlerName: "onGuardSuccess", patternKey: "GUARD_SUCCESS" },
	{ eventHandlerName: "onGuardFail", patternKey: "GUARD_FAIL" },
	{ eventHandlerName: "onEnemyHit", patternKey: "ENEMY_HIT" },
	{ eventHandlerName: "onPlayerDeath", patternKey: "PLAYER_DEATH" },
	{ eventHandlerName: "onKeyPickup", patternKey: "KEY_PICKUP" },
	{ eventHandlerName: "onCameraSwitch", patternKey: "CAMERA_SWITCH" },
	{ eventHandlerName: "onTransition", patternKey: "TRANSITION_FIRE" },
	{ eventHandlerName: "onAchievement", patternKey: "ACHIEVEMENT" },
	{ eventHandlerName: "onFloorComplete", patternKey: "FLOOR_COMPLETE" },
];

describe("useHaptics", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockUseWebHaptics.mockReturnValue({
			trigger: mockTrigger,
			cancel: mockCancel,
			isSupported: true,
		});
	});

	it.each(
		HAPTIC_EVENT_CASES,
	)("triggers configured pattern for $eventHandlerName", ({
		eventHandlerName,
		patternKey,
	}) => {
		const { result } = renderHook(() => useHaptics());

		act(() => {
			result.current[eventHandlerName]();
		});

		expect(mockTrigger).toHaveBeenCalledWith(HAPTIC_PATTERNS[patternKey]);
	});

	it("delegates to library trigger even when isSupported is false", () => {
		mockUseWebHaptics.mockReturnValue({
			trigger: mockTrigger,
			cancel: mockCancel,
			isSupported: false,
		});

		const { result } = renderHook(() => useHaptics());

		act(() => {
			result.current.onRoomEnter();
		});

		expect(mockTrigger).toHaveBeenCalledWith(HAPTIC_PATTERNS.ROOM_ENTER);
	});

	it("suppresses haptic triggers when disabled in settings", () => {
		let hapticsEnabled = true;
		const { result, rerender } = renderHook(() =>
			useHaptics({ hapticsEnabled }),
		);

		act(() => {
			hapticsEnabled = false;
			rerender();
		});

		act(() => {
			result.current.onRoomEnter();
		});

		expect(mockTrigger).not.toHaveBeenCalled();

		act(() => {
			hapticsEnabled = true;
			rerender();
		});

		act(() => {
			result.current.onRoomEnter();
		});

		expect(mockTrigger).toHaveBeenCalledWith(HAPTIC_PATTERNS.ROOM_ENTER);
	});

	it("throttles rapid consecutive triggers", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

		const { result } = renderHook(() => useHaptics());

		act(() => {
			result.current.onEnemyHit();
			result.current.onEnemyHit();
		});

		expect(mockTrigger).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(HAPTIC_THROTTLE_MS);
			result.current.onEnemyHit();
		});

		expect(mockTrigger).toHaveBeenCalledTimes(2);

		vi.useRealTimers();
	});
});
