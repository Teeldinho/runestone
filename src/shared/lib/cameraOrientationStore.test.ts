import { afterEach, describe, expect, it } from "vitest";

import {
	getCameraAzimuth,
	setCameraAzimuth,
} from "./cameraOrientationStore";

describe("cameraOrientationStore", () => {
	afterEach(() => {
		setCameraAzimuth(0);
	});

	it("returns 0 as the initial azimuth", () => {
		expect(getCameraAzimuth()).toBe(0);
	});

	it("stores and retrieves the camera azimuth", () => {
		setCameraAzimuth(Math.PI / 2);
		expect(getCameraAzimuth()).toBe(Math.PI / 2);
	});

	it("overwrites previous azimuth value", () => {
		setCameraAzimuth(1.0);
		setCameraAzimuth(2.5);
		expect(getCameraAzimuth()).toBe(2.5);
	});

	it("handles negative azimuth values", () => {
		setCameraAzimuth(-Math.PI);
		expect(getCameraAzimuth()).toBe(-Math.PI);
	});
});
