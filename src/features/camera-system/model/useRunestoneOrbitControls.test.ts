// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CameraModeId } from "@/features/camera-system/config";
import { CAMERA_MODES } from "@/features/camera-system/config";

const frameCallbacks: Array<() => void> = [];
const mockGetPlayerPosition = vi.fn();
const mockIsDesktopLayout = vi.fn();
const mockSetCameraAzimuth = vi.fn();

const mockCamera = new THREE.PerspectiveCamera();
mockCamera.fov = 60;

vi.mock("@react-three/fiber", () => ({
	useFrame: (callback: () => void) => {
		frameCallbacks.push(callback);
	},
	useThree: () => ({
		camera: mockCamera,
	}),
}));

vi.mock("@/shared/lib", async (importOriginal) => {
	const original = await importOriginal<typeof import("@/shared/lib")>();

	return {
		...original,
		getPlayerPosition: () => mockGetPlayerPosition(),
		setCameraAzimuth: (...args: unknown[]) => mockSetCameraAzimuth(...args),
		useResponsiveLayout: () => ({
			isDesktopLayout: mockIsDesktopLayout(),
		}),
	};
});

import { useRunestoneOrbitControls } from "./useRunestoneOrbitControls";

describe("useRunestoneOrbitControls", () => {
	const cameraActorRef = {
		send: vi.fn(),
	};

	beforeEach(() => {
		frameCallbacks.length = 0;
		vi.clearAllMocks();
		mockCamera.position.set(0, 2, -6);
		mockCamera.up.set(0, 1, 0);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		mockIsDesktopLayout.mockReturnValue(true);
	});

	it("samples movement azimuth from the camera snapshot instead of world direction", () => {
		const getWorldDirection = vi
			.spyOn(mockCamera, "getWorldDirection")
			.mockImplementation((direction) => direction.set(1, 0, 0));

		const { result } = renderHook(() =>
			useRunestoneOrbitControls({
				cameraActorRef: cameraActorRef as never,
				cameraSnapshot: {
					distance: 6,
					fov: 60,
					mode: CAMERA_MODES.THIRD_PERSON,
					pitch: 0.25,
					position: [0, 2, -6],
					target: [0, 1, 0],
					yaw: 1.75,
					zoom: 1,
				},
			}),
		);

		result.current.controlsRef.current = {
			target: new THREE.Vector3(),
		} as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(getWorldDirection).not.toHaveBeenCalled();
		expect(mockSetCameraAzimuth).toHaveBeenCalledWith(1.75);
	});

	it("keeps third-person upright after leaving top-down mode", () => {
		let mode: CameraModeId = CAMERA_MODES.TOP_DOWN;
		let pitch = 0;
		let yaw = 0;

		const { result, rerender } = renderHook(() =>
			useRunestoneOrbitControls({
				cameraActorRef: cameraActorRef as never,
				cameraSnapshot: {
					distance: 6,
					fov: 60,
					mode,
					pitch,
					position: [0, 2, -6],
					target: [0, 1, 0],
					yaw,
					zoom: 1,
				},
			}),
		);

		result.current.controlsRef.current = {
			target: new THREE.Vector3(),
		} as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.up.toArray()).toEqual([0, 0, 1]);
		expect(mockSetCameraAzimuth).toHaveBeenCalledWith(0);

		mode = CAMERA_MODES.THIRD_PERSON;
		pitch = 0.35;
		yaw = -0.8;

		rerender();

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.up.toArray()).toEqual([0, 1, 0]);
		expect(mockSetCameraAzimuth).toHaveBeenCalledWith(-0.8);
		expect(mockCamera.getWorldDirection).not.toHaveBeenCalled();
	});

	it("keeps movement-only follow updates from changing azimuth or emitting look deltas", () => {
		const { result, rerender } = renderHook(() =>
			useRunestoneOrbitControls({
				cameraActorRef: cameraActorRef as never,
				cameraSnapshot: {
					distance: 6,
					fov: 60,
					mode: CAMERA_MODES.THIRD_PERSON,
					pitch: 0.25,
					position: [0, 2, -6],
					target: [0, 1, 0],
					yaw: 0.45,
					zoom: 1,
				},
			}),
		);

		result.current.controlsRef.current = {
			target: new THREE.Vector3(),
		} as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		mockGetPlayerPosition.mockReturnValue([4, 0.9, -2]);
		rerender();

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockSetCameraAzimuth).toHaveBeenNthCalledWith(1, 0.45);
		expect(mockSetCameraAzimuth).toHaveBeenNthCalledWith(2, 0.45);
		expect(cameraActorRef.send).not.toHaveBeenCalledWith(
			expect.objectContaining({ type: "LOOK_CHANGED" }),
		);
		expect(mockCamera.getWorldDirection).not.toHaveBeenCalled();
	});
});
