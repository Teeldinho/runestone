import { CAMERA_LIMITS } from "../config";

export type OrbitControlsSnapshot = {
	readonly distance: number;
	readonly pitch: number;
	readonly yaw: number;
};

export type OrbitControlsSnapshotDiff = {
	readonly hasLookDelta: boolean;
	readonly hasZoomDelta: boolean;
	readonly lookDelta: {
		readonly x: number;
		readonly y: number;
	};
	readonly zoomDelta: number;
};

type ResolveOrbitControlsSnapshotDiffInput = {
	readonly current: OrbitControlsSnapshot;
	readonly previous: OrbitControlsSnapshot;
};

const isWithinOrbitControlsDiffEpsilon = (value: number): boolean =>
	Math.abs(value) < CAMERA_LIMITS.ORBIT_CONTROLS_DIFF_EPSILON;

export const resolveOrbitControlsSnapshotDiff = ({
	current,
	previous,
}: ResolveOrbitControlsSnapshotDiffInput): OrbitControlsSnapshotDiff => {
	const rawLookDeltaX = previous.yaw - current.yaw;
	const rawLookDeltaY = previous.pitch - current.pitch;
	const rawZoomDelta =
		(current.distance - previous.distance) / CAMERA_LIMITS.ZOOM_STEP;

	return {
		hasLookDelta:
			!isWithinOrbitControlsDiffEpsilon(rawLookDeltaX) ||
			!isWithinOrbitControlsDiffEpsilon(rawLookDeltaY),
		hasZoomDelta: !isWithinOrbitControlsDiffEpsilon(rawZoomDelta),
		lookDelta: {
			x: rawLookDeltaX,
			y: rawLookDeltaY,
		},
		zoomDelta: rawZoomDelta,
	};
};
