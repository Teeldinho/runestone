import { describe, expect, it } from "vitest";

import {
	CAMERA_CONTROLS_UP_AXIS_KEYS,
	CAMERA_MODE_IDS,
	CAMERA_UP_VECTORS,
} from "../config";
import {
	resolveCameraControlsUpAxisKey,
	resolveCameraControlsUpVector,
} from "./resolveCameraControlsUpAxis";

describe("resolveCameraControlsUpAxis", () => {
	it("uses the upright axis for non-top-down modes", () => {
		expect(resolveCameraControlsUpAxisKey(CAMERA_MODE_IDS.THIRD_PERSON)).toBe(
			CAMERA_CONTROLS_UP_AXIS_KEYS.UPRIGHT,
		);
		expect(resolveCameraControlsUpVector(CAMERA_MODE_IDS.THIRD_PERSON)).toEqual(
			CAMERA_UP_VECTORS.DEFAULT,
		);
	});

	it("uses the top-down axis for top-down mode", () => {
		expect(resolveCameraControlsUpAxisKey(CAMERA_MODE_IDS.TOP_DOWN)).toBe(
			CAMERA_CONTROLS_UP_AXIS_KEYS.TOP_DOWN,
		);
		expect(resolveCameraControlsUpVector(CAMERA_MODE_IDS.TOP_DOWN)).toEqual(
			CAMERA_UP_VECTORS.TOP_DOWN,
		);
	});
});
