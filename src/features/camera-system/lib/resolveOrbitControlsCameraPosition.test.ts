import { describe, expect, it } from "vitest";

import { resolveOrbitControlsCameraPosition } from "./resolveOrbitControlsCameraPosition";

describe("resolveOrbitControlsCameraPosition", () => {
	it("preserves the camera offset while translating to the next target", () => {
		expect(
			resolveOrbitControlsCameraPosition({
				cameraPosition: [0, 2.2, -4.4],
				currentTarget: [10, 1.7, 5],
				nextTarget: [14, 1.7, 8],
			}),
		).toEqual([4, 2.2, -1.4000000000000004]);
	});
});
