import type { Vector3Tuple } from "@/shared/lib";

import type { CameraStateSnapshot } from "../model/types";

type ResolveCameraControlsModePoseInput = {
	readonly cameraSnapshot: CameraStateSnapshot;
	readonly followTarget: Vector3Tuple;
};

export type CameraControlsModePose = {
	readonly position: Vector3Tuple;
	readonly target: Vector3Tuple;
};

const subtractVector = (
	left: Vector3Tuple,
	right: Vector3Tuple,
): Vector3Tuple => [left[0] - right[0], left[1] - right[1], left[2] - right[2]];

const addVector = (left: Vector3Tuple, right: Vector3Tuple): Vector3Tuple => [
	left[0] + right[0],
	left[1] + right[1],
	left[2] + right[2],
];

export const resolveCameraControlsModePose = ({
	cameraSnapshot,
	followTarget,
}: ResolveCameraControlsModePoseInput): CameraControlsModePose => {
	const presetOffset = subtractVector(
		cameraSnapshot.position,
		cameraSnapshot.target,
	);

	return {
		position: addVector(followTarget, presetOffset),
		target: followTarget,
	};
};

export type { ResolveCameraControlsModePoseInput };
