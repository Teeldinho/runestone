// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_EVENTS, CAMERA_MODES } from "@/features/camera-system";

import { useCameraModeSwitcher } from "./useCameraModeSwitcher";

describe("useCameraModeSwitcher", () => {
	it("marks only the active camera mode button as active", () => {
		const handleCameraModeSwitch = vi.fn();

		const { result } = renderHook(() =>
			useCameraModeSwitcher({
				activeCameraMode: CAMERA_MODES.TOP_DOWN,
				handleCameraModeSwitch,
			}),
		);

		expect(result.current.cameraModeButtons).toHaveLength(4);
		expect(
			result.current.cameraModeButtons.filter((button) => button.isActive),
		).toEqual([
			expect.objectContaining({
				mode: CAMERA_MODES.TOP_DOWN,
			}),
		]);
	});

	it("dispatches the expected camera switch event when a mode button is pressed", () => {
		const handleCameraModeSwitch = vi.fn();

		const { result } = renderHook(() =>
			useCameraModeSwitcher({
				activeCameraMode: CAMERA_MODES.FREE_ORBITAL,
				handleCameraModeSwitch,
			}),
		);

		const topDownButton = result.current.cameraModeButtons.find(
			(button) => button.mode === CAMERA_MODES.TOP_DOWN,
		);

		expect(topDownButton).toBeDefined();

		act(() => {
			topDownButton?.handleCameraModeSwitch();
		});

		expect(handleCameraModeSwitch).toHaveBeenCalledWith({
			type: CAMERA_EVENTS.SWITCH_TO_TOP_DOWN,
		});
	});
});
