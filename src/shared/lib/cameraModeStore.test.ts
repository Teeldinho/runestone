import { beforeEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/shared/config";

import {
	getCameraMode,
	setCameraMode,
	subscribeToCameraMode,
} from "./cameraModeStore";

describe("cameraModeStore", () => {
	beforeEach(() => {
		setCameraMode(CAMERA_MODES.THIRD_PERSON);
	});

	it("initializes with the third-person camera mode", () => {
		expect(getCameraMode()).toBe(CAMERA_MODES.THIRD_PERSON);
	});

	it("notifies subscribers when camera mode changes", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToCameraMode(listener);

		setCameraMode(CAMERA_MODES.FIRST_PERSON);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(getCameraMode()).toBe(CAMERA_MODES.FIRST_PERSON);

		unsubscribe();
	});

	it("stops notifications after unsubscribe", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToCameraMode(listener);

		unsubscribe();
		setCameraMode(CAMERA_MODES.TOP_DOWN);

		expect(listener).not.toHaveBeenCalled();
	});
});
