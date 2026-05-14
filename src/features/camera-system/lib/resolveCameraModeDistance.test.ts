import { describe, expect, it } from "vitest";

import { CAMERA_MODE_IDS } from "../config";
import { resolveCameraModeDistance } from "./resolveCameraModeDistance";

describe("resolveCameraModeDistance", () => {
	it("returns the third-person orbit distance", () => {
		expect(resolveCameraModeDistance(CAMERA_MODE_IDS.THIRD_PERSON)).toBeCloseTo(
			Math.hypot(2.2, 4.4),
			6,
		);
	});

	it("returns the top-down orbit distance", () => {
		expect(resolveCameraModeDistance(CAMERA_MODE_IDS.TOP_DOWN)).toBe(20);
	});

	it("returns the first-person orbit distance", () => {
		expect(resolveCameraModeDistance(CAMERA_MODE_IDS.FIRST_PERSON)).toBe(1);
	});

	it("returns the free-orbit distance", () => {
		expect(resolveCameraModeDistance(CAMERA_MODE_IDS.FREE_ORBIT)).toBeCloseTo(
			Math.hypot(16, 18),
			6,
		);
	});
});
