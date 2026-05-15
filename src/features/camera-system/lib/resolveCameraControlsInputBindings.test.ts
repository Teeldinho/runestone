import CameraControlsImpl from "camera-controls";
import { describe, expect, it } from "vitest";

import { CAMERA_MODE_IDS } from "../config";
import { resolveCameraControlsInputBindings } from "./resolveCameraControlsInputBindings";

const { ACTION } = CameraControlsImpl;

describe("resolveCameraControlsInputBindings", () => {
	it("returns top-down bindings", () => {
		expect(
			resolveCameraControlsInputBindings(CAMERA_MODE_IDS.TOP_DOWN),
		).toEqual({
			mouseButtons: {
				left: ACTION.NONE,
				middle: ACTION.DOLLY,
				right: ACTION.NONE,
				wheel: ACTION.DOLLY,
			},
			touches: {
				one: ACTION.NONE,
				two: ACTION.TOUCH_DOLLY,
				three: ACTION.NONE,
			},
		});
	});

	it("returns first-person bindings", () => {
		expect(
			resolveCameraControlsInputBindings(CAMERA_MODE_IDS.FIRST_PERSON),
		).toEqual({
			mouseButtons: {
				left: ACTION.ROTATE,
				middle: ACTION.NONE,
				right: ACTION.NONE,
				wheel: ACTION.NONE,
			},
			touches: {
				one: ACTION.TOUCH_ROTATE,
				two: ACTION.NONE,
				three: ACTION.NONE,
			},
		});
	});

	it("returns free-orbit bindings", () => {
		expect(
			resolveCameraControlsInputBindings(CAMERA_MODE_IDS.FREE_ORBIT),
		).toEqual({
			mouseButtons: {
				left: ACTION.ROTATE,
				middle: ACTION.DOLLY,
				right: ACTION.TRUCK,
				wheel: ACTION.DOLLY,
			},
			touches: {
				one: ACTION.TOUCH_ROTATE,
				two: ACTION.TOUCH_DOLLY_TRUCK,
				three: ACTION.NONE,
			},
		});
	});
});
