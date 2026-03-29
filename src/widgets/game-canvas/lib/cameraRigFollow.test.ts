import { describe, expect, it } from "vitest";

import { getPreservedOrbitCameraPosition } from "./cameraRigFollow";

describe("getPreservedOrbitCameraPosition", () => {
	it("preserves the current orbit offset while moving to a new target", () => {
		expect(
			getPreservedOrbitCameraPosition({
				cameraPosition: [2, 5, -3],
				currentTarget: [1, 1, 1],
				nextTarget: [6, 1, 4],
			}),
		).toEqual([7, 5, 0]);
	});
});
