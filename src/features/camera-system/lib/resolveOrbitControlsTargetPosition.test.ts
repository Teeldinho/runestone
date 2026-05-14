import { describe, expect, it } from "vitest";

import { PLAYER_EYE_HEIGHT } from "@/shared/config";

import { CAMERA_MODE_IDS } from "../config";
import { resolveOrbitControlsTargetPosition } from "./resolveOrbitControlsTargetPosition";

describe("resolveOrbitControlsTargetPosition", () => {
	it("targets the player head in third-person", () => {
		expect(
			resolveOrbitControlsTargetPosition({
				cameraMode: CAMERA_MODE_IDS.THIRD_PERSON,
				cameraPitch: 0,
				cameraYaw: 0,
				distance: 4.9,
				playerPosition: [1, 2, 3],
			}),
		).toEqual([1, 2 + PLAYER_EYE_HEIGHT, 3]);
	});

	it("targets the player position in top-down", () => {
		expect(
			resolveOrbitControlsTargetPosition({
				cameraMode: CAMERA_MODE_IDS.TOP_DOWN,
				cameraPitch: 0,
				cameraYaw: 0,
				distance: 20,
				playerPosition: [1, 2, 3],
			}),
		).toEqual([1, 2, 3]);
	});

	it("targets the player head offset in free-orbit", () => {
		expect(
			resolveOrbitControlsTargetPosition({
				cameraMode: CAMERA_MODE_IDS.FREE_ORBIT,
				cameraPitch: 0,
				cameraYaw: 0,
				distance: 24,
				playerPosition: [1, 2, 3],
			}),
		).toEqual([1, 3.25, 3]);
	});

	it("targets forward from the player head in first-person", () => {
		const target = resolveOrbitControlsTargetPosition({
			cameraMode: CAMERA_MODE_IDS.FIRST_PERSON,
			cameraPitch: 0,
			cameraYaw: 0,
			distance: 1,
			playerPosition: [1, 2, 3],
		});

		expect(target[0]).toBeCloseTo(1, 6);
		expect(target[1]).toBeCloseTo(2 + PLAYER_EYE_HEIGHT, 6);
		expect(target[2]).toBeCloseTo(4, 6);
	});
});
