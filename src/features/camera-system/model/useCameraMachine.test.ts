// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENT_TYPES,
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
	CAMERA_MODES,
} from "../config";
import { useCameraMachine } from "./useCameraMachine";

describe("useCameraMachine", () => {
	it("starts in the default camera mode", () => {
		const { result } = renderHook(() => useCameraMachine());

		expect(result.current.mode).toBe(CAMERA_DEFAULT_MODE);
	});

	it("switches mode from explicit camera events", () => {
		const { result } = renderHook(() => useCameraMachine());

		act(() => {
			result.current.handleCameraModeSwitch({
				type: CAMERA_EVENTS.SWITCH_TO_TOP_DOWN,
			});
		});

		expect(result.current.mode).toBe(CAMERA_MODES.TOP_DOWN);
	});

	it("handles keyboard hotkeys for mode switching", () => {
		const { result } = renderHook(() => useCameraMachine());

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: CAMERA_HOTKEYS.FIRST_PERSON,
				}),
			);
		});

		expect(result.current.mode).toBe(CAMERA_MODES.FIRST_PERSON);
	});

	it("continues responding to camera events after rerender", () => {
		const { result, rerender } = renderHook(() => useCameraMachine());

		act(() => {
			result.current.handleCameraModeSwitch({
				type: CAMERA_EVENTS.SWITCH_TO_THIRD_PERSON,
			});
		});

		rerender();

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: CAMERA_HOTKEYS.TOP_DOWN,
				}),
			);
		});

		expect(result.current.mode).toBe(CAMERA_MODES.TOP_DOWN);
	});

	it("exposes updated yaw and pitch in the camera state snapshot", () => {
		const { result } = renderHook(() => useCameraMachine());

		act(() => {
			result.current.actor.send({
				type: CAMERA_EVENT_TYPES.LOOK_CHANGED,
				delta: { x: 2, y: -3 },
			});
		});

		expect(result.current.cameraStateSnapshot.yaw).not.toBe(0);
		expect(result.current.cameraStateSnapshot.pitch).not.toBe(0);
	});
});
