import { describe, expect, it } from "vitest";

import {
	getPreservedOrbitCameraPosition,
	resolveOrbitFollowUpdate,
} from "./cameraRigFollow";

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

	it("skips orbit follow updates when the next target stays within recenter distance", () => {
		expect(
			resolveOrbitFollowUpdate({
				cameraPosition: { x: 10, y: 18.9, z: 13 },
				currentTarget: { x: 10, y: 0.9, z: -5 },
				nextTarget: [12, 0.9, -4],
				recenterDistance: 6,
			}),
		).toBeNull();
	});

	it("returns the preserved orbit position when the next target exceeds recenter distance", () => {
		expect(
			resolveOrbitFollowUpdate({
				cameraPosition: { x: 10, y: 18.9, z: 13 },
				currentTarget: { x: 10, y: 0.9, z: -5 },
				nextTarget: [18, 0.9, -5],
				recenterDistance: 6,
			}),
		).toEqual({
			desiredCameraPosition: [18, 18.9, 13],
			nextTarget: [18, 0.9, -5],
		});
	});
});
