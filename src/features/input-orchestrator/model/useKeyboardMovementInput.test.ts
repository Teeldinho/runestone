// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { INPUT_EVENT_TYPES } from "../config";

import { useKeyboardMovementInput } from "./useKeyboardMovementInput";

describe("useKeyboardMovementInput", () => {
	it("sends movement updates and stop events for keyboard input", () => {
		const sendInput = vi.fn();

		const { unmount } = renderHook(() =>
			useKeyboardMovementInput({
				sendInput,
				isRunToggled: false,
			}),
		);

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", { key: "w", code: "KeyW" }),
			);
		});

		expect(sendInput).toHaveBeenCalledWith(
			expect.objectContaining({
				type: INPUT_EVENT_TYPES.MOVE_CHANGED,
				vector: { x: 0, y: -1 },
				magnitude: 1,
				wantsRun: false,
			}),
		);

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keyup", { key: "w", code: "KeyW" }),
			);
		});

		expect(sendInput).toHaveBeenCalledWith({
			type: INPUT_EVENT_TYPES.MOVE_STOPPED,
		});

		unmount();
	});

	it("uses the run toggle state when dispatching movement", () => {
		const sendInput = vi.fn();
		const { unmount } = renderHook(() =>
			useKeyboardMovementInput({
				sendInput,
				isRunToggled: true,
			}),
		);

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", { key: "w", code: "KeyW" }),
			);
		});

		expect(sendInput).toHaveBeenCalledWith(
			expect.objectContaining({ wantsRun: true }),
		);

		unmount();
	});
});
