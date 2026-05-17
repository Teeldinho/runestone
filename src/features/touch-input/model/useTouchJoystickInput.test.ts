// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { TOUCH_JOYSTICK_CONFIG } from "../config";
import { useTouchJoystickInput } from "./useTouchJoystickInput";

const flushJoystickAnimationFrame = async () => {
	await act(async () => {
		await new Promise<void>((resolve) => {
			requestAnimationFrame(() => resolve());
		});
	});
};

const createGlobalPointerEvent = (type: string, pointerId: number) => {
	const event = new Event(type, {
		bubbles: true,
		cancelable: true,
	}) as PointerEvent;

	Object.defineProperty(event, "pointerId", {
		value: pointerId,
	});

	return event;
};

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

	it("resets when capture is lost, the window blurs, or the document hides", () => {
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
		const releasePointerCapture = vi.fn();

		const startDrag = (pointerId: number) => {
			act(() => {
				result.current.handlePointerDown({
					pointerId,
					clientX: 110,
					clientY: 66,
					currentTarget: {
						setPointerCapture,
					},
					stopPropagation: vi.fn(),
					preventDefault: vi.fn(),
				} as unknown as ReactPointerEvent<HTMLDivElement>);
			});
		};

		startDrag(1);

		act(() => {
			result.current.handlePointerLostPointerCapture({
				pointerId: 1,
				currentTarget: {
					hasPointerCapture: vi.fn(),
					releasePointerCapture,
				},
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		expect(handleStop).toHaveBeenCalledTimes(1);
		expect(result.current.isActive).toBe(false);

		startDrag(2);

		act(() => {
			window.dispatchEvent(new Event("blur"));
		});

		expect(handleStop).toHaveBeenCalledTimes(2);
		expect(result.current.isActive).toBe(false);

		startDrag(3);

		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "hidden",
		});

		act(() => {
			document.dispatchEvent(new Event("visibilitychange"));
		});

		expect(handleStop).toHaveBeenCalledTimes(3);
		expect(result.current.isActive).toBe(false);
		expect(releasePointerCapture).not.toHaveBeenCalled();
	});

	it("releases the active pointer on unmount", () => {
		const handleMove = vi.fn();
		const handleStop = vi.fn();
		const { result, unmount } = renderHook(() =>
			useTouchJoystickInput({ onMove: handleMove, onStop: handleStop }),
		);

		const joystickElement = document.createElement("div");
		const releasePointerCapture = vi.fn();
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
		joystickElement.hasPointerCapture = vi.fn().mockReturnValue(true);
		joystickElement.releasePointerCapture = releasePointerCapture;
		result.current.joystickRef.current = joystickElement;

		act(() => {
			result.current.handlePointerDown({
				pointerId: 7,
				clientX: 110,
				clientY: 66,
				currentTarget: {
					setPointerCapture: vi.fn(),
				},
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		unmount();

		expect(releasePointerCapture).toHaveBeenCalledWith(7);
		expect(handleStop).toHaveBeenCalledTimes(1);
	});

	it.each([
		"pointerup",
		"pointercancel",
	] as const)("resets the visual knob when %s happens outside the joystick", async (eventType) => {
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
				width: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				height: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				right: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				bottom: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect;
		joystickElement.hasPointerCapture = vi.fn().mockReturnValue(true);
		joystickElement.releasePointerCapture = vi.fn();
		result.current.joystickRef.current = joystickElement;

		act(() => {
			result.current.handlePointerDown({
				pointerId: 11,
				clientX:
					TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX / 2 +
					TOUCH_JOYSTICK_CONFIG.MAX_RADIUS_PX,
				clientY: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX / 2,
				currentTarget: {
					setPointerCapture: vi.fn(),
				},
				stopPropagation: vi.fn(),
				preventDefault: vi.fn(),
			} as unknown as ReactPointerEvent<HTMLDivElement>);
		});

		await flushJoystickAnimationFrame();

		expect(result.current.isActive).toBe(true);
		expect(result.current.knobOffsetX).toBe(
			TOUCH_JOYSTICK_CONFIG.MAX_RADIUS_PX,
		);

		const offCanvasReleaseTarget = document.createElement("div");
		document.body.append(offCanvasReleaseTarget);
		offCanvasReleaseTarget.addEventListener(eventType, (event) => {
			event.stopPropagation();
		});

		act(() => {
			offCanvasReleaseTarget.dispatchEvent(
				createGlobalPointerEvent(eventType, 11),
			);
		});

		offCanvasReleaseTarget.remove();

		expect(result.current.isActive).toBe(false);
		expect(result.current.knobOffsetX).toBe(
			TOUCH_JOYSTICK_CONFIG.RESTING_KNOB_OFFSET_PX,
		);
		expect(result.current.knobOffsetY).toBe(
			TOUCH_JOYSTICK_CONFIG.RESTING_KNOB_OFFSET_PX,
		);
		expect(handleStop).toHaveBeenCalledTimes(1);
	});
});
