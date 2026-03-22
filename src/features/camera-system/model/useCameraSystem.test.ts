// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
	CAMERA_MODES,
} from "@/features/camera-system/config";

import { useCameraSystem } from "./useCameraSystem";

describe("useCameraSystem", () => {
	it("starts with default camera mode snapshot", () => {
		const { result } = renderHook(() => useCameraSystem());

		expect(result.current.cameraStateSnapshot.mode).toBe(CAMERA_DEFAULT_MODE);
	});

	it("updates snapshot when an explicit switch event is dispatched", () => {
		const { result } = renderHook(() => useCameraSystem());

		act(() => {
			result.current.handleCameraModeSwitch({
				type: CAMERA_EVENTS.SWITCH_TO_FIRST_PERSON,
			});
		});

		expect(result.current.cameraStateSnapshot.mode).toBe(
			CAMERA_MODES.FIRST_PERSON,
		);
	});

	it("handles keyboard hotkeys for camera mode switching", () => {
		const { result } = renderHook(() => useCameraSystem());

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: CAMERA_HOTKEYS.TOP_DOWN,
				}),
			);
		});

		expect(result.current.cameraStateSnapshot.mode).toBe(CAMERA_MODES.TOP_DOWN);
	});

	it("ignores keys that are not camera hotkeys", () => {
		const { result } = renderHook(() => useCameraSystem());

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "k",
				}),
			);
		});

		expect(result.current.cameraStateSnapshot.mode).toBe(CAMERA_DEFAULT_MODE);
	});
});
