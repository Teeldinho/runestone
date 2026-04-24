import * as THREE from "three";

import {
	type CameraStateSnapshot,
	resolveCameraAzimuth,
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

export const syncMovementAzimuth = ({
	camera,
	cameraStateSnapshot,
	directionRef,
}: SyncMovementAzimuthInput): void => {
	camera.getWorldDirection(directionRef.current);
	const nextAzimuth = resolveCameraAzimuth({
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
