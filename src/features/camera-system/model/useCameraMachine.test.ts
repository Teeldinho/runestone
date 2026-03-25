// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CAMERA_EVENTS, CAMERA_HOTKEYS, CAMERA_MODES } from "../config";
import { useCameraMachine } from "./useCameraMachine";

describe("useCameraMachine", () => {
	it("starts in free orbital mode", () => {
		const { result } = renderHook(() => useCameraMachine());

		expect(result.current.mode).toBe(CAMERA_MODES.FREE_ORBITAL);
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
});
