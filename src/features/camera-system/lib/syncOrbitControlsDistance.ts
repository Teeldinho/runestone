import type { Camera, Vector3 } from "three";

import { clampCameraDistance } from "./clampCameraDistance";

type SyncOrbitControlsDistanceInput = {
	readonly camera: Camera;
	readonly target: Vector3;
	readonly desiredDistance: number;
};

export const syncOrbitControlsDistance = ({
	camera,
	target,
	desiredDistance,
}: SyncOrbitControlsDistanceInput): void => {
	const direction = camera.position.clone().sub(target);
	const distance = clampCameraDistance(desiredDistance);

	direction.setLength(distance);
	camera.position.copy(target.clone().add(direction));
};
