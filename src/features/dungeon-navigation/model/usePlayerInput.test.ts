// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PLAYER_EVENTS } from "@/entities/player";

import { usePlayerInput } from "./usePlayerInput";

describe("usePlayerInput", () => {
	let sendPlayerEvent: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		sendPlayerEvent = vi.fn();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("sends MOVE with forward velocity on W keydown", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));

		expect(sendPlayerEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.MOVE,
			velocity: [0, 0, -1],
			isSprinting: false,
		});
	});

	it("sends MOVE with backward velocity on S keydown", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "s" }));

		expect(sendPlayerEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.MOVE,
			velocity: [0, 0, 1],
			isSprinting: false,
		});
	});

	it("sends MOVE with left velocity on A keydown", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));

		expect(sendPlayerEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.MOVE,
			velocity: [-1, 0, 0],
			isSprinting: false,
		});
	});

	it("sends MOVE with right velocity on D keydown", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));

		expect(sendPlayerEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.MOVE,
			velocity: [1, 0, 0],
			isSprinting: false,
		});
	});

	it("sends STOP when the only held key is released", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
		window.dispatchEvent(new KeyboardEvent("keyup", { key: "w" }));

		expect(sendPlayerEvent).toHaveBeenLastCalledWith({
			type: PLAYER_EVENTS.STOP,
		});
	});

	it("sends MOVE with combined velocity when two keys are held", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));

		expect(sendPlayerEvent).toHaveBeenLastCalledWith({
			type: PLAYER_EVENTS.MOVE,
			velocity: [1, 0, -1],
			isSprinting: false,
		});
	});

	it("sends MOVE with remaining direction when one key released while another held", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
		window.dispatchEvent(new KeyboardEvent("keyup", { key: "d" }));

		expect(sendPlayerEvent).toHaveBeenLastCalledWith({
			type: PLAYER_EVENTS.MOVE,
			velocity: [0, 0, -1],
			isSprinting: false,
		});
	});

	it("ignores non-WASD keys", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "e" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Space" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));

		expect(sendPlayerEvent).not.toHaveBeenCalled();
	});

	it("does not double-send when same key pressed while already held", () => {
		renderHook(() => usePlayerInput({ sendPlayerEvent }));

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));

		expect(sendPlayerEvent).toHaveBeenCalledTimes(1);
	});

	it("removes event listeners on unmount", () => {
		const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
		const { unmount } = renderHook(() => usePlayerInput({ sendPlayerEvent }));

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"keydown",
			expect.any(Function),
		);
		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"keyup",
			expect.any(Function),
		);

		removeEventListenerSpy.mockRestore();
	});
});
