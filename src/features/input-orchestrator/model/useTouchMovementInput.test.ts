// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { INPUT_EVENT_TYPES } from "../config";
import { useTouchMovementInput } from "./useTouchMovementInput";

describe("useTouchMovementInput", () => {
	it("does not derive run from joystick magnitude", () => {
		const sendInput = vi.fn();
		const { result } = renderHook(() =>
			useTouchMovementInput({
				isRunToggled: false,
				sendInput,
			}),
		);

		result.current.handleMoveVelocity([1, 0, 1]);

		expect(sendInput).toHaveBeenCalledWith(
			expect.objectContaining({
				type: INPUT_EVENT_TYPES.MOVE_CHANGED,
				wantsRun: false,
			}),
		);
	});

	it("uses explicit run toggle state for touch movement", () => {
		const sendInput = vi.fn();
		const { result } = renderHook(() =>
			useTouchMovementInput({
				isRunToggled: true,
				sendInput,
			}),
		);

		result.current.handleMoveVelocity([1, 0, 1]);

		expect(sendInput).toHaveBeenCalledWith(
			expect.objectContaining({
				type: INPUT_EVENT_TYPES.MOVE_CHANGED,
				wantsRun: true,
			}),
		);
	});
});
