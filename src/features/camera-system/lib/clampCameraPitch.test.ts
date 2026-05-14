import { describe, expect, it } from "vitest";

import { CAMERA_LOOK_LIMITS } from "../config";

import { clampCameraPitch } from "./clampCameraPitch";

describe("clampCameraPitch", () => {
	it("clamps pitch at the upper limit", () => {
		expect(clampCameraPitch(2)).toBe(CAMERA_LOOK_LIMITS.MAX_PITCH);
	});

	it("clamps pitch at the lower limit", () => {
		expect(clampCameraPitch(-2)).toBe(CAMERA_LOOK_LIMITS.MIN_PITCH);
	});

	it("preserves pitch values within the allowed range", () => {
		expect(clampCameraPitch(0.5)).toBe(0.5);
	});
});
