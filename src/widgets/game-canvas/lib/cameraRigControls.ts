import type * as THREE from "three";

import type { Vector3Tuple } from "@/shared/types";

type OrbitControlsHandle = {
	target: THREE.Vector3;
	update: () => void;
	enableRotate: boolean;
};

export const setCameraUp = (
	camera: THREE.Camera,
	[nextX, nextY, nextZ]: Vector3Tuple,
): void => {
	camera.up.set(nextX, nextY, nextZ);
};

export const setOrbitTarget = (
	orbitControls: OrbitControlsHandle | null,
	[nextX, nextY, nextZ]: Vector3Tuple,
): void => {
	if (!orbitControls) {
		return;
	}

	orbitControls.target.set(nextX, nextY, nextZ);
	orbitControls.update();
};

export type { OrbitControlsHandle };
