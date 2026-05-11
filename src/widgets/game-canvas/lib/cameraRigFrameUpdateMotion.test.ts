import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";

import {
	syncMovementAzimuth,
	updatePerspectiveFov,
} from "./cameraRigFrameUpdateMotion";

const mockResolveCameraAzimuth = vi.fn();
const mockSetCameraAzimuth = vi.fn();

vi.mock("@/features/camera-system", async (importOriginal) => {
	const original =
		await importOriginal<typeof import("@/features/camera-system")>();

	return {
		...original,
		resolveCameraAzimuth: (...args: unknown[]) =>
			mockResolveCameraAzimuth(...args),
	};
});

vi.mock("@/shared/lib", async (importOriginal) => {
	const original = await importOriginal<typeof import("@/shared/lib")>();

	return {
		...original,
		setCameraAzimuth: (...args: unknown[]) => mockSetCameraAzimuth(...args),
	};
});

describe("cameraRigFrameUpdateMotion", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockResolveCameraAzimuth.mockReturnValue(null);
	});

	it("syncs movement azimuth when the resolver returns a value", () => {
		const camera = new THREE.PerspectiveCamera();
		const directionRef = { current: new THREE.Vector3() };

		mockResolveCameraAzimuth.mockReturnValue(7);

		syncMovementAzimuth({
			camera,
			cameraStateSnapshot: {
				fov: 60,
				mode: CAMERA_MODES.THIRD_PERSON,
				position: [0, 0, 0],
				target: [0, 0, 0],
				zoom: 1,
				yaw: 0,
				pitch: 0,
				distance: 6,
			},
			directionRef,
		});

		expect(mockSetCameraAzimuth).toHaveBeenCalledWith(7);
	});

	it("skips movement azimuth sync when the resolver returns null", () => {
		const camera = new THREE.PerspectiveCamera();
		const directionRef = { current: new THREE.Vector3() };

		syncMovementAzimuth({
			camera,
			cameraStateSnapshot: {
				fov: 60,
				mode: CAMERA_MODES.THIRD_PERSON,
				position: [0, 0, 0],
				target: [0, 0, 0],
				zoom: 1,
				yaw: 0,
				pitch: 0,
				distance: 6,
			},
			directionRef,
		});

		expect(mockSetCameraAzimuth).not.toHaveBeenCalled();
	});

	it("eases the camera fov toward the snapshot fov and updates projection", () => {
		const camera = new THREE.PerspectiveCamera();
		camera.fov = 50;
		const updateProjectionMatrix = vi.spyOn(camera, "updateProjectionMatrix");

		updatePerspectiveFov({
			camera,
			cameraStateSnapshot: {
				fov: 60,
				mode: CAMERA_MODES.THIRD_PERSON,
				position: [0, 0, 0],
				target: [0, 0, 0],
				zoom: 1,
				yaw: 0,
				pitch: 0,
				distance: 6,
			},
			transitionAlpha: 0.5,
		});

		expect(camera.fov).toBeCloseTo(55, 8);
		expect(updateProjectionMatrix).toHaveBeenCalledTimes(1);
	});

	it("ignores fov updates when the difference is within epsilon", () => {
		const camera = new THREE.PerspectiveCamera();
		camera.fov = 60;
		const updateProjectionMatrix = vi.spyOn(camera, "updateProjectionMatrix");

		updatePerspectiveFov({
			camera,
			cameraStateSnapshot: {
				fov: 60.005,
				mode: CAMERA_MODES.THIRD_PERSON,
				position: [0, 0, 0],
				target: [0, 0, 0],
				zoom: 1,
				yaw: 0,
				pitch: 0,
				distance: 6,
			},
			transitionAlpha: 0.5,
		});

		expect(camera.fov).toBe(60);
		expect(updateProjectionMatrix).not.toHaveBeenCalled();
	});
});
