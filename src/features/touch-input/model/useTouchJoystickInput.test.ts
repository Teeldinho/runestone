// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { useTouchJoystickInput } from "./useTouchJoystickInput";

describe("useTouchJoystickInput", () => {
	it("captures the active pointer and sends MOVE velocity while dragging", () => {
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
		const setPointerCapture = vi.fn();

		act(() => {
			result.current.handlePointerDown({
				pointerId: 1,
				clientX: 110,
				clientY: 66,
				currentTarget: {
					setPointerCapture,
				},
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		expect(setPointerCapture).toHaveBeenCalledWith(1);
		expect(handleMove).toHaveBeenCalled();
		expect(result.current.isActive).toBe(true);

		act(() => {
			result.current.handlePointerMove({
				pointerId: 2,
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		expect(handleMove).toHaveBeenCalledTimes(1);
	});

	it("resets on pointer up and pointer cancel", () => {
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
					hasPointerCapture: vi.fn().mockReturnValue(true),
					releasePointerCapture: vi.fn(),
				},
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		act(() => {
			result.current.handlePointerUp({
				pointerId: 1,
				currentTarget: {
					hasPointerCapture: vi.fn().mockReturnValue(true),
					releasePointerCapture: vi.fn(),
				},
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		expect(handleStop).toHaveBeenCalled();
		expect(result.current.isActive).toBe(false);

		act(() => {
			result.current.handlePointerDown({
				pointerId: 2,
				clientX: 110,
				clientY: 66,
				currentTarget: {
					setPointerCapture: vi.fn(),
					hasPointerCapture: vi.fn().mockReturnValue(true),
					releasePointerCapture: vi.fn(),
				},
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		act(() => {
			result.current.handlePointerCancel({
				pointerId: 2,
				currentTarget: {
					hasPointerCapture: vi.fn().mockReturnValue(true),
					releasePointerCapture: vi.fn(),
				},
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		expect(handleStop).toHaveBeenCalledTimes(2);
		expect(result.current.isActive).toBe(false);
	});
});
