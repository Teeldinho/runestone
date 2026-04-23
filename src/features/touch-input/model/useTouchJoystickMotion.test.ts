// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useTouchJoystickMotion } from "./useTouchJoystickMotion";

describe("useTouchJoystickMotion", () => {
	it("activates the joystick, updates motion, and emits stop on reset", () => {
		const handleMove = vi.fn();
		const handleStop = vi.fn();
		const { result } = renderHook(() =>
			useTouchJoystickMotion({ onMove: handleMove, onStop: handleStop }),
		);

		const joystickElement = document.createElement("div");
		joystickElement.getBoundingClientRect = () =>
			({
				left: 0,
				top: 0,
				width: 132,
				height: 132,
				right: 132,
				bottom: 132,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect;
		result.current.joystickRef.current = joystickElement;

		act(() => {
			result.current.beginJoystickMotion(110, 66);
		});

		expect(result.current.isActive).toBe(true);
		expect(handleMove).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.updateJoystickMotion(111, 66);
		});

		expect(handleMove).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.updateJoystickMotion(66, 110);
		});

		expect(handleMove).toHaveBeenCalledTimes(2);

		act(() => {
			result.current.resetJoystickMotion();
		});

		expect(handleStop).toHaveBeenCalledTimes(1);
		expect(result.current.isActive).toBe(false);
		expect(result.current.knobOffsetX).toBe(0);
		expect(result.current.knobOffsetY).toBe(0);
	});
});
