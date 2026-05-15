import { describe, expect, it } from "vitest";

import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";

import { CAMERA_MODE_IDS } from "../config";
import { resolveCameraControlsFollowTarget } from "./resolveCameraControlsFollowTarget";

describe("resolveCameraControlsFollowTarget", () => {
	it("uses the player head for third-person mode", () => {
		expect(
			resolveCameraControlsFollowTarget({
				mode: CAMERA_MODE_IDS.THIRD_PERSON,
				playerPosition: [4, 5, 6],
			}),
		).toEqual([4, 5 + PLAYER_EYE_HEIGHT, 6]);
	});

	it("uses the player root for top-down mode", () => {
		expect(
			resolveCameraControlsFollowTarget({
				mode: CAMERA_MODE_IDS.TOP_DOWN,
				playerPosition: [4, 5, 6],
			}),
		).toEqual([4, 5, 6]);
	});

	it("uses the player head for first-person mode", () => {
		expect(
			resolveCameraControlsFollowTarget({
				mode: CAMERA_MODE_IDS.FIRST_PERSON,
				playerPosition: [4, 5, 6],
			}),
		).toEqual([4, 5 + PLAYER_EYE_HEIGHT, 6]);
	});

	it("applies the free-orbit target offset", () => {
		expect(
			resolveCameraControlsFollowTarget({
				mode: CAMERA_MODE_IDS.FREE_ORBIT,
				playerPosition: [4, 5, 6],
			}),
		).toEqual([4, 5 + CAMERA_CONFIG.FREE_ORBITAL.TARGET_OFFSET_Y, 6]);
	});
});
