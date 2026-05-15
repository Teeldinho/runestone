import { describe, expect, it } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system/config";
import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";

import { createCameraStateSnapshot } from "./cameraStateSnapshot";

describe("createCameraStateSnapshot", () => {
	it("creates third-person snapshot from camera config", () => {
		const result = createCameraStateSnapshot(CAMERA_MODES.THIRD_PERSON);

		expect(result.mode).toBe(CAMERA_MODES.THIRD_PERSON);
		expect(result.fov).toBe(CAMERA_CONFIG.THIRD_PERSON.FOV);
		expect(result.position).toEqual(CAMERA_CONFIG.THIRD_PERSON.OFFSET);
		expect(result.target).toEqual([0, PLAYER_EYE_HEIGHT, 0]);
		expect(result.zoom).toBe(1);
	});

	it("creates top-down snapshot from camera config", () => {
		const result = createCameraStateSnapshot(CAMERA_MODES.TOP_DOWN);

		expect(result.mode).toBe(CAMERA_MODES.TOP_DOWN);
		expect(result.fov).toBe(CAMERA_CONFIG.TOP_DOWN.FOV);
		expect(result.position).toEqual([
			0,
			CAMERA_CONFIG.TOP_DOWN.HEIGHT,
			CAMERA_CONFIG.TOP_DOWN.DISTANCE,
		]);
		expect(result.target).toEqual([0, 0, 0]);
		expect(result.zoom).toBe(1);
	});

	it("creates first-person snapshot from camera config", () => {
		const result = createCameraStateSnapshot(CAMERA_MODES.FIRST_PERSON);

		expect(result.mode).toBe(CAMERA_MODES.FIRST_PERSON);
		expect(result.fov).toBe(CAMERA_CONFIG.FIRST_PERSON.FOV);
		expect(result.position).toEqual([0, PLAYER_EYE_HEIGHT, 0.01]);
		expect(result.target).toEqual([0, PLAYER_EYE_HEIGHT, 0]);
		expect(result.zoom).toBe(1);
	});

	it("creates free-orbital snapshot from camera config", () => {
		const result = createCameraStateSnapshot(CAMERA_MODES.FREE_ORBITAL);

		expect(result.mode).toBe(CAMERA_MODES.FREE_ORBITAL);
		expect(result.fov).toBe(CAMERA_CONFIG.FREE_ORBITAL.FOV);
		expect(result.position).toEqual(
			CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION,
		);
		expect(result.target).toEqual([0, 0, 0]);
		expect(result.zoom).toBe(1);
	});
});
