// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { INPUT_EVENT_TYPES, TOUCH_LOOK_CONFIG } from "../config";
import { useTouchLookInput } from "./useTouchLookInput";

type MockPointerEvent = ReactPointerEvent<HTMLDivElement> & {
	currentTarget: {
		hasPointerCapture: (pointerId: number) => boolean;
		releasePointerCapture: (pointerId: number) => void;
		setPointerCapture: (pointerId: number) => void;
	};
	target: EventTarget;
};

const createPointerEvent = ({
	clientX,
	clientY,
	pointerId = 1,
}: {
	readonly clientX: number;
	readonly clientY: number;
	readonly pointerId?: number;
}): MockPointerEvent =>
	({
		clientX,
		clientY,
		currentTarget: {
			hasPointerCapture: vi.fn(() => true),
			releasePointerCapture: vi.fn(),
			setPointerCapture: vi.fn(),
		},
		pointerId,
		pointerType: "touch",
		preventDefault: vi.fn(),
		target: document.createElement("div"),
	}) as unknown as MockPointerEvent;

describe("useTouchLookInput", () => {
	beforeEach(() => {
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			value: 1280,
		});
		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			value: 720,
		});
	});

	it("sends LOOK_CHANGED with viewport-normalised angular deltas", () => {
		const sendInput = vi.fn();
		const { result } = renderHook(() => useTouchLookInput({ sendInput }));

		act(() => {
			result.current.handlePointerDown(
				createPointerEvent({ clientX: 0, clientY: 0 }),
			);
		});

		act(() => {
			result.current.handlePointerMove(
				createPointerEvent({ clientX: 1280, clientY: 720 }),
			);
		});

		const lookChangedEvent = sendInput.mock.calls.find(
			([event]) => event.type === INPUT_EVENT_TYPES.LOOK_CHANGED,
		)?.[0];

		expect(lookChangedEvent).toBeTruthy();
		expect(lookChangedEvent?.delta.x).toBeCloseTo(
			TOUCH_LOOK_CONFIG.YAW_RADIANS_PER_FULL_VIEWPORT_DRAG,
		);
		expect(lookChangedEvent?.delta.y).toBeCloseTo(
			TOUCH_LOOK_CONFIG.PITCH_RADIANS_PER_FULL_VIEWPORT_DRAG,
		);
	});
});
