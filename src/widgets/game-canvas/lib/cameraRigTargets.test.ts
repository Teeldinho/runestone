import { describe, expect, it } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";
import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";

import { getCameraRigTargets } from "./cameraRigTargets";

describe("getCameraRigTargets", () => {
	it("centers free-orbital mode on the player using the configured offset", () => {
		const result = getCameraRigTargets({
			mode: CAMERA_MODES.FREE_ORBITAL,
			playerPosition: [10, 0.9, -5],
		});

		expect(result.position).toEqual([
			10 + CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION[0],
			0.9 + CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION[1],
			-5 + CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION[2],
		]);
		expect(result.lookAt).toEqual([10, 0.9, -5]);
	});

	it("returns a strict overhead target for top-down mode", () => {
		const result = getCameraRigTargets({
			mode: CAMERA_MODES.TOP_DOWN,
			playerPosition: [3, 0.9, -7],
		});

		expect(result.position).toEqual([3, CAMERA_CONFIG.TOP_DOWN.HEIGHT, -7]);
		expect(result.lookAt).toEqual([3, 0.9, -7]);
	});

	it("places first-person camera at player eye height", () => {
		const result = getCameraRigTargets({
			mode: CAMERA_MODES.FIRST_PERSON,
			playerPosition: [2, 0.9, 4],
		});

		expect(result.position).toEqual([2, 0.9 + PLAYER_EYE_HEIGHT, 4]);
		expect(result.lookAt).toEqual([2, 0.9 + PLAYER_EYE_HEIGHT, 5]);
	});
});
