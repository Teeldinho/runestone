import { CAMERA_MODES } from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import { getPlayerPosition, hasPlayerPosition } from "@/shared/lib";

import {
	CAMERA_RIG_FREE_ORBITAL_RECENTER_DISTANCE,
	CAMERA_RIG_LERP_ALPHA,
	CAMERA_RIG_TRANSITION_JUMP_DISTANCE,
} from "../config";
import { checkOrbitFollowJump } from "./cameraRigFollow";
import type {
	CameraRigFrameFlags,
	ResolveCameraRigFrameFlagsInput,
} from "./cameraRigFrameUpdate";

type ResolveTrackedPlayerPositionInput = {
	playerSpawnPosition: Vector3Tuple;
};

export const resolveTrackedPlayerPosition = ({
	playerSpawnPosition,
}: ResolveTrackedPlayerPositionInput): Vector3Tuple =>
	hasPlayerPosition() ? getPlayerPosition() : playerSpawnPosition;

export const resolveCameraRigFrameFlags = ({
	mode,
	previousMode,
	needsFreeOrbitalSync,
	needsThirdPersonSync,
	isUserInteracting,
	trackedPlayerPosition,
	previousTrackedPlayerPosition,
}: ResolveCameraRigFrameFlagsInput): CameraRigFrameFlags => {
	const isModeChange = mode !== previousMode;
	const isFreeOrbitalJump =
		mode === CAMERA_MODES.FREE_ORBITAL &&
		!isModeChange &&
		!needsFreeOrbitalSync &&
		!isUserInteracting &&
		checkOrbitFollowJump({
			jumpDistance: CAMERA_RIG_FREE_ORBITAL_RECENTER_DISTANCE,
			nextTarget: trackedPlayerPosition,
			previousTarget: previousTrackedPlayerPosition,
		});
	const isThirdPersonJump =
		mode === CAMERA_MODES.THIRD_PERSON &&
		!isModeChange &&
		!needsThirdPersonSync &&
		checkOrbitFollowJump({
			jumpDistance: CAMERA_RIG_TRANSITION_JUMP_DISTANCE,
			nextTarget: trackedPlayerPosition,
			previousTarget: previousTrackedPlayerPosition,
		});

	return {
		isModeChange,
		isFreeOrbitalJump,
		isThirdPersonJump,
		transitionAlpha: isModeChange ? 1 : CAMERA_RIG_LERP_ALPHA,
	};
};

export const checkShouldSyncMovementAzimuth = ({
	isModeChange,
	isUserInteracting,
	mode,
	needsFreeOrbitalSync,
}: {
	isModeChange: boolean;
	isUserInteracting: boolean;
	mode: (typeof CAMERA_MODES)[keyof typeof CAMERA_MODES];
	needsFreeOrbitalSync: boolean;
}): boolean => {
	if (mode !== CAMERA_MODES.FREE_ORBITAL) {
		return true;
	}

	return isModeChange || needsFreeOrbitalSync || isUserInteracting;
};

export type { ResolveTrackedPlayerPositionInput };
