import { describe, expect, it, vi } from "vitest";

import {
	getCameraMode,
	setCameraMode,
	subscribeToCameraMode,
} from "./cameraModeStore";

describe("cameraModeStore", () => {
	it("notifies subscribers when camera mode changes", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToCameraMode(listener);

		setCameraMode("firstPerson");

		expect(listener).toHaveBeenCalledTimes(1);
		expect(getCameraMode()).toBe("firstPerson");

		unsubscribe();
	});

	it("stops notifications after unsubscribe", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToCameraMode(listener);

		unsubscribe();
		setCameraMode("topDown");

		expect(listener).not.toHaveBeenCalled();
	});
});
