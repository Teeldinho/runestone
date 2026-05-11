import { describe, expect, it } from "vitest";

import { CAMERA_MODE_IDS } from "../config";
import { shouldRenderOrbitControls } from "./shouldRenderOrbitControls";

describe("shouldRenderOrbitControls", () => {
	it("returns false for first-person", () => {
		expect(shouldRenderOrbitControls(CAMERA_MODE_IDS.FIRST_PERSON)).toBe(false);
	});

	it("returns true for third-person", () => {
		expect(shouldRenderOrbitControls(CAMERA_MODE_IDS.THIRD_PERSON)).toBe(true);
	});

	it("returns true for top-down", () => {
		expect(shouldRenderOrbitControls(CAMERA_MODE_IDS.TOP_DOWN)).toBe(true);
	});

	it("returns true for free-orbit", () => {
		expect(shouldRenderOrbitControls(CAMERA_MODE_IDS.FREE_ORBIT)).toBe(true);
	});
});
