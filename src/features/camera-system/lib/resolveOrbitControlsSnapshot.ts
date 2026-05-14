import type { OrbitControlsSnapshot } from "./resolveOrbitControlsSnapshotDiff";

type OrbitControlsSnapshotSource = {
	readonly getAzimuthalAngle: () => number;
	readonly getDistance: () => number;
	readonly getPolarAngle: () => number;
};

export const resolveOrbitControlsSnapshot = (
	controls: OrbitControlsSnapshotSource,
): OrbitControlsSnapshot => ({
	distance: controls.getDistance(),
	pitch: Math.PI / 2 - controls.getPolarAngle(),
	yaw: controls.getAzimuthalAngle(),
});

export type { OrbitControlsSnapshotSource };
