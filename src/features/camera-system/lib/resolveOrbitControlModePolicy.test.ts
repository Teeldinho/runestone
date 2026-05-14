import { describe, expect, it } from "vitest";

import { CAMERA_MODE_IDS } from "../config";
import { resolveOrbitControlModePolicy } from "./resolveOrbitControlModePolicy";

describe("resolveOrbitControlModePolicy", () => {
	it("enables rotate but disables pan and zoom for first-person", () => {
		const policy = resolveOrbitControlModePolicy(CAMERA_MODE_IDS.FIRST_PERSON);

		expect(policy.enableRotate).toBe(true);
		expect(policy.enablePan).toBe(false);
		expect(policy.enableZoom).toBe(false);
	});

	it("disables rotate/pan for top-down, allows zoom", () => {
		const policy = resolveOrbitControlModePolicy(CAMERA_MODE_IDS.TOP_DOWN);

		expect(policy.enableRotate).toBe(false);
		expect(policy.enablePan).toBe(false);
		expect(policy.enableZoom).toBe(true);
	});

	it("enables rotate/zoom for third-person, disables pan", () => {
		const policy = resolveOrbitControlModePolicy(CAMERA_MODE_IDS.THIRD_PERSON);

		expect(policy.enableRotate).toBe(true);
		expect(policy.enablePan).toBe(false);
		expect(policy.enableZoom).toBe(true);
	});

	it("enables pan/rotate/zoom for free-orbit", () => {
		const policy = resolveOrbitControlModePolicy(CAMERA_MODE_IDS.FREE_ORBIT);

		expect(policy.enableRotate).toBe(true);
		expect(policy.enablePan).toBe(true);
		expect(policy.enableZoom).toBe(true);
	});
});
