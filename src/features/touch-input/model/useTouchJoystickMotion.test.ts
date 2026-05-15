// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TOUCH_JOYSTICK_CONFIG } from "../config";
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
				width: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				height: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				right: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				bottom: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect;
		result.current.joystickRef.current = joystickElement;

		act(() => {
			result.current.beginJoystickMotion(140, 88);
		});

		expect(result.current.isActive).toBe(true);
		expect(handleMove).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.updateJoystickMotion(141, 88);
		});

		expect(handleMove).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.updateJoystickMotion(88, 140);
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
