// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_MODES, useCameraMachine } from "@/features/camera-system";

import { useGamePageCamera } from "./useGamePageCamera";

vi.mock("@/features/camera-system");

describe("useGamePageCamera", () => {
	it("returns camera state snapshot and mode switch handler", () => {
		const mockCameraSnapshot = {
			fov: 58,
			mode: CAMERA_MODES.FREE_ORBITAL,
			position: [0, 8, 10] as [number, number, number],
			target: [0, 0, 0] as [number, number, number],
			zoom: 1,
		};
		const mockHandleCameraModeSwitch = vi.fn();

		vi.mocked(useCameraMachine).mockReturnValue({
			cameraStateSnapshot: mockCameraSnapshot,
			handleCameraModeSwitch: mockHandleCameraModeSwitch,
			mode: CAMERA_MODES.FREE_ORBITAL,
			actor: {} as never,
			switchToThirdPerson: vi.fn(),
			switchToTopDown: vi.fn(),
			switchToFirstPerson: vi.fn(),
			switchToFreeOrbital: vi.fn(),
		});

		const { result } = renderHook(() => useGamePageCamera());

		expect(result.current.cameraStateSnapshot).toBe(mockCameraSnapshot);
		expect(result.current.handleCameraModeSwitch).toBe(
			mockHandleCameraModeSwitch,
		);
		expect(result.current.cameraMode).toBe(CAMERA_MODES.FREE_ORBITAL);
	});

	it("passes through different camera modes", () => {
		vi.mocked(useCameraMachine).mockReturnValue({
			cameraStateSnapshot: {
				fov: 75,
				mode: CAMERA_MODES.THIRD_PERSON,
				position: [0, 5, 8] as [number, number, number],
				target: [0, 0, 0] as [number, number, number],
				zoom: 1.5,
			},
			handleCameraModeSwitch: vi.fn(),
			mode: CAMERA_MODES.THIRD_PERSON,
			actor: {} as never,
			switchToThirdPerson: vi.fn(),
			switchToTopDown: vi.fn(),
			switchToFirstPerson: vi.fn(),
			switchToFreeOrbital: vi.fn(),
		});

		const { result } = renderHook(() => useGamePageCamera());

		expect(result.current.cameraStateSnapshot.mode).toBe(
			CAMERA_MODES.THIRD_PERSON,
		);
		expect(result.current.cameraMode).toBe(CAMERA_MODES.THIRD_PERSON);
	});

	it("handles top down camera mode", () => {
		vi.mocked(useCameraMachine).mockReturnValue({
			cameraStateSnapshot: {
				fov: 60,
				mode: CAMERA_MODES.TOP_DOWN,
				position: [0, 15, 0] as [number, number, number],
				target: [0, 0, 0] as [number, number, number],
				zoom: 2,
			},
			handleCameraModeSwitch: vi.fn(),
			mode: CAMERA_MODES.TOP_DOWN,
			actor: {} as never,
			switchToThirdPerson: vi.fn(),
			switchToTopDown: vi.fn(),
			switchToFirstPerson: vi.fn(),
			switchToFreeOrbital: vi.fn(),
		});

		const { result } = renderHook(() => useGamePageCamera());

		expect(result.current.cameraStateSnapshot.mode).toBe(CAMERA_MODES.TOP_DOWN);
		expect(result.current.cameraMode).toBe(CAMERA_MODES.TOP_DOWN);
	});
});
