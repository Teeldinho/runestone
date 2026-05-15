import { describe, expect, it } from "vitest";

import { CAMERA_RIG_FIRST_PERSON_MOBILE_LOOK_LERP_ALPHA } from "../config";
import { resolveFirstPersonMobileLookAngles } from "./resolveFirstPersonMobileLookAngles";

describe("resolveFirstPersonMobileLookAngles", () => {
	it("returns the current angles when the target matches them", () => {
		expect(
			resolveFirstPersonMobileLookAngles({
				currentPitch: 0.5,
				currentYaw: -0.25,
				targetPitch: 0.5,
				targetYaw: -0.25,
			}),
		).toEqual({
			pitch: 0.5,
			yaw: -0.25,
		});
	});

	it("interpolates yaw toward the target", () => {
		expect(
			resolveFirstPersonMobileLookAngles({
				currentPitch: 0,
				currentYaw: 0,
				targetPitch: 0,
				targetYaw: 1,
			}),
		).toEqual({
			pitch: 0,
			yaw: CAMERA_RIG_FIRST_PERSON_MOBILE_LOOK_LERP_ALPHA,
		});
	});

	it("interpolates pitch toward the target", () => {
		expect(
			resolveFirstPersonMobileLookAngles({
				currentPitch: 0,
				currentYaw: 0,
				targetPitch: 1,
				targetYaw: 0,
			}),
		).toEqual({
			pitch: CAMERA_RIG_FIRST_PERSON_MOBILE_LOOK_LERP_ALPHA,
			yaw: 0,
		});
	});
});
