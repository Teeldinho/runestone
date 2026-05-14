import { describe, expect, it } from "vitest";

import { CAMERA_LIMITS } from "../config";
import { resolveOrbitControlsSnapshotDiff } from "./resolveOrbitControlsSnapshotDiff";

describe("resolveOrbitControlsSnapshotDiff", () => {
	it("returns no diff for matching snapshots", () => {
		const diff = resolveOrbitControlsSnapshotDiff({
			current: {
				distance: 4.9,
				pitch: 0,
				yaw: 0,
			},
			previous: {
				distance: 4.9,
				pitch: 0,
				yaw: 0,
			},
		});

		expect(diff.hasLookDelta).toBe(false);
		expect(diff.hasZoomDelta).toBe(false);
		expect(diff.lookDelta).toEqual({ x: 0, y: 0 });
		expect(diff.zoomDelta).toBe(0);
	});

	it("returns inverted look deltas that match the machine event semantics", () => {
		const diff = resolveOrbitControlsSnapshotDiff({
			current: {
				distance: 4.9,
				pitch: 0.25,
				yaw: -0.75,
			},
			previous: {
				distance: 4.9,
				pitch: 0,
				yaw: 0,
			},
		});

		expect(diff.hasLookDelta).toBe(true);
		expect(diff.lookDelta).toEqual({
			x: 0.75,
			y: -0.25,
		});
	});

	it("normalizes zoom delta by the configured zoom step", () => {
		const diff = resolveOrbitControlsSnapshotDiff({
			current: {
				distance: 6.1,
				pitch: 0,
				yaw: 0,
			},
			previous: {
				distance: 4.9,
				pitch: 0,
				yaw: 0,
			},
		});

		expect(diff.hasZoomDelta).toBe(true);
		expect(diff.zoomDelta).toBeCloseTo(
			(6.1 - 4.9) / CAMERA_LIMITS.ZOOM_STEP,
			6,
		);
	});
});
