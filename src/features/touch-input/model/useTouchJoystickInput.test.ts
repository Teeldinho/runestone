// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { useTouchJoystickInput } from "./useTouchJoystickInput";

describe("useTouchJoystickInput", () => {
	it("sends MOVE velocity while dragging and STOP on pointer release", () => {
		const handleMove = vi.fn();
		const handleStop = vi.fn();
		const { result } = renderHook(() =>
			useTouchJoystickInput({ onMove: handleMove, onStop: handleStop }),
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
			result.current.handlePointerDown({
				pointerId: 1,
				clientX: 110,
				clientY: 66,
				currentTarget: {
					setPointerCapture: vi.fn(),
				},
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		expect(handleMove).toHaveBeenCalled();
		expect(result.current.isActive).toBe(true);

		act(() => {
			result.current.handlePointerUp({
				pointerId: 1,
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		expect(handleStop).toHaveBeenCalled();
		expect(result.current.isActive).toBe(false);
	});
});
