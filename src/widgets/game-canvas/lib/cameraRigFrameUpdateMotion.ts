import * as THREE from "three";

import {
	CAMERA_MODES,
	type CameraStateSnapshot,
} from "@/features/camera-system";
import { setCameraAzimuth } from "@/shared/lib";
import { CAMERA_RIG_FOV_EPSILON } from "../config";
import type { CameraRigFrameUpdateInput } from "./cameraRigFrameUpdate";

type SyncMovementAzimuthInput = Pick<
	CameraRigFrameUpdateInput,
	"camera" | "directionRef"
> & {
	cameraStateSnapshot: CameraStateSnapshot;
};

type UpdatePerspectiveFovInput = Pick<CameraRigFrameUpdateInput, "camera"> & {
	cameraStateSnapshot: CameraStateSnapshot;
	transitionAlpha: number;
};

type CameraDirection = {
	x: number;
	y: number;
	z: number;
};

const resolveMovementAzimuth = ({
	direction,
	mode,
}: {
	direction: CameraDirection;
	mode: CameraStateSnapshot["mode"];
}): number | null => {
	if (mode === CAMERA_MODES.TOP_DOWN) {
		return 0;
	}

	const horizontalMagnitude = Math.hypot(direction.x, direction.z);

	if (horizontalMagnitude === 0) {
		return null;
	}

	return Math.atan2(direction.x, direction.z);
};

export const syncMovementAzimuth = ({
	camera,
	cameraStateSnapshot,
	directionRef,
}: SyncMovementAzimuthInput): void => {
	camera.getWorldDirection(directionRef.current);
	const nextAzimuth = resolveMovementAzimuth({
		mode: cameraStateSnapshot.mode,
		direction: directionRef.current,
	});

	if (nextAzimuth !== null) {
		setCameraAzimuth(nextAzimuth);
	}
};

export const updatePerspectiveFov = ({
	camera,
	cameraStateSnapshot,
	transitionAlpha,
}: UpdatePerspectiveFovInput): void => {
	if (!(camera instanceof THREE.PerspectiveCamera)) {
		return;
	}

	const fovDifference = Math.abs(camera.fov - cameraStateSnapshot.fov);

	if (fovDifference > CAMERA_RIG_FOV_EPSILON) {
		camera.fov += (cameraStateSnapshot.fov - camera.fov) * transitionAlpha;
		camera.updateProjectionMatrix();
	}
};

export type { SyncMovementAzimuthInput, UpdatePerspectiveFovInput };
