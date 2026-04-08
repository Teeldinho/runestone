import { describe, expect, it } from "vitest";
import { DOOR_SIDES } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { DOORWAY_NAVIGATION_CONFIG } from "@/features/dungeon-navigation";
import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";

import { CAMERA_RIG_THIRD_PERSON_TRANSITION_PADDING } from "../config";

import {
	getCameraRigTargets,
	getThirdPersonTransitionTargets,
} from "./cameraRigTargets";

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
		expect(result.lookAt).toEqual([
			10,
			0.9 + CAMERA_CONFIG.FREE_ORBITAL.TARGET_OFFSET_Y,
			-5,
		]);
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

	it("keeps third-person transition framing behind north-entry travel while clamped inside the room", () => {
		const result = getThirdPersonTransitionTargets({
			doorSide: DOOR_SIDES.NORTH,
			playerPosition: [10, 0.9, 0],
		});

		expect(result.position).toEqual([
			10,
			3.1,
			-(
				DOORWAY_NAVIGATION_CONFIG.ARRIVAL_OFFSET -
				CAMERA_RIG_THIRD_PERSON_TRANSITION_PADDING
			),
		]);
		expect(result.lookAt).toEqual([10, 0.9 + PLAYER_EYE_HEIGHT, 0]);
	});

	it("keeps third-person transition framing behind west-entry travel while clamped inside the room", () => {
		const result = getThirdPersonTransitionTargets({
			doorSide: DOOR_SIDES.WEST,
			playerPosition: [10, 0.9, 0],
		});

		expect(result.position).toEqual([
			10 -
				(DOORWAY_NAVIGATION_CONFIG.ARRIVAL_OFFSET -
					CAMERA_RIG_THIRD_PERSON_TRANSITION_PADDING),
			3.1,
			0,
		]);
		expect(result.lookAt).toEqual([10, 0.9 + PLAYER_EYE_HEIGHT, 0]);
	});
});
