// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { CAMERA_MODES } from "@/features/camera-system";

import { useGamePageMobileCameraControlHandlers } from "./useGamePageMobileCameraControlHandlers";

describe("useGamePageMobileCameraControlHandlers", () => {
	const createSnapshot = (
		mode: CameraStateSnapshot["mode"],
	): CameraStateSnapshot => ({
		fov: 78,
		mode,
		position: [0, 0, 0],
		target: [0, 0, 0],
		zoom: 1,
		yaw: 0,
		pitch: 0,
		distance: 6,
	});

	const fakeHandlers = () => ({
		handlePointerDown: vi.fn(),
		handlePointerMove: vi.fn(),
		handlePointerUp: vi.fn(),
		handlePointerCancel: vi.fn(),
	});

	it("returns undefined handlers for third-person", () => {
		const touchLook = fakeHandlers();

		const { result } = renderHook(() =>
			useGamePageMobileCameraControlHandlers({
				cameraStateSnapshot: createSnapshot(CAMERA_MODES.THIRD_PERSON),
				touchLook,
			}),
		);

		expect(result.current.onLookPointerDown).toBeUndefined();
		expect(result.current.onLookPointerMove).toBeUndefined();
		expect(result.current.onLookPointerUp).toBeUndefined();
		expect(result.current.onLookPointerCancel).toBeUndefined();
	});

	it("returns undefined handlers for free-orbit", () => {
		const touchLook = fakeHandlers();

		const { result } = renderHook(() =>
			useGamePageMobileCameraControlHandlers({
				cameraStateSnapshot: createSnapshot(CAMERA_MODES.FREE_ORBITAL),
				touchLook,
			}),
		);

		expect(result.current.onLookPointerDown).toBeUndefined();
	});

	it("returns undefined handlers for top-down", () => {
		const touchLook = fakeHandlers();

		const { result } = renderHook(() =>
			useGamePageMobileCameraControlHandlers({
				cameraStateSnapshot: createSnapshot(CAMERA_MODES.TOP_DOWN),
				touchLook,
			}),
		);

		expect(result.current.onLookPointerDown).toBeUndefined();
	});

	it("returns touch look handlers for first-person", () => {
		const touchLook = fakeHandlers();

		const { result } = renderHook(() =>
			useGamePageMobileCameraControlHandlers({
				cameraStateSnapshot: createSnapshot(CAMERA_MODES.FIRST_PERSON),
				touchLook,
			}),
		);

		expect(result.current.onLookPointerDown).toBe(touchLook.handlePointerDown);
		expect(result.current.onLookPointerMove).toBe(touchLook.handlePointerMove);
		expect(result.current.onLookPointerUp).toBe(touchLook.handlePointerUp);
		expect(result.current.onLookPointerCancel).toBe(
			touchLook.handlePointerCancel,
		);
	});
});
