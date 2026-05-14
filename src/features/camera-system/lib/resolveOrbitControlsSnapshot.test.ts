import { describe, expect, it, vi } from "vitest";

import { resolveOrbitControlsSnapshot } from "./resolveOrbitControlsSnapshot";

describe("resolveOrbitControlsSnapshot", () => {
	it("reads yaw, pitch, and distance from OrbitControls", () => {
		const controls = {
			getAzimuthalAngle: vi.fn(() => 1.25),
			getDistance: vi.fn(() => 7.5),
			getPolarAngle: vi.fn(() => Math.PI / 2 - 0.75),
		};

		expect(resolveOrbitControlsSnapshot(controls)).toEqual({
			distance: 7.5,
			pitch: 0.75,
			yaw: 1.25,
		});
	});
});
