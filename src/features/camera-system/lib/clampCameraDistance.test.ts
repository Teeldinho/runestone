import { describe, expect, it } from "vitest";

import { CAMERA_LIMITS } from "../config";
import { clampCameraDistance } from "./clampCameraDistance";

describe("clampCameraDistance", () => {
	it("returns min distance when below range", () => {
		expect(clampCameraDistance(0)).toBe(CAMERA_LIMITS.MIN_DISTANCE);
	});

	it("returns max distance when above range", () => {
		expect(clampCameraDistance(999)).toBe(CAMERA_LIMITS.MAX_DISTANCE);
	});

	it("returns the distance when within range", () => {
		expect(clampCameraDistance(6)).toBe(6);
	});
});
