import type { MutableRefObject, RefObject } from "react";
import type * as THREE from "three";

import type { LastTransition } from "@/entities/dungeon";
import {
	CAMERA_MODES,
	type CameraStateSnapshot,
} from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import type { OrbitControlsHandle } from "./cameraRigControls";
import {
	applyFirstPersonFrame,
	applyFreeOrbitalFrame,
	applyThirdPersonFrame,
	applyTopDownFrame,
} from "./cameraRigFrameUpdateModeApplications";
import {
	syncMovementAzimuth,
	updatePerspectiveFov,
} from "./cameraRigFrameUpdateMotion";
import {
	checkShouldSyncMovementAzimuth,
	resolveCameraRigFrameFlags,
	resolveTrackedPlayerPosition,
} from "./cameraRigFrameUpdateState";
import { getCameraRigTargets } from "./cameraRigTargets";

type PointerLockControlsHandle = {
	isLocked: boolean;
};

type CameraRigFrameUpdateInput = {
	camera: THREE.Camera;
	cameraStateSnapshot?: CameraStateSnapshot;
	directionRef: MutableRefObject<THREE.Vector3>;
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	firstPersonTargetVectorRef: MutableRefObject<THREE.Vector3>;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	isDesktopLayout: boolean;
	isUserInteractingRef: MutableRefObject<boolean>;
	lastTransition: LastTransition | null;
	lookAtVectorRef: MutableRefObject<THREE.Vector3>;
	needsFirstPersonSyncRef: MutableRefObject<boolean>;
	needsFreeOrbitalSyncRef: MutableRefObject<boolean>;
	needsThirdPersonSyncRef: MutableRefObject<boolean>;
	needsTopDownSyncRef: MutableRefObject<boolean>;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	playerSpawnPosition: Vector3Tuple;
	positionVectorRef: MutableRefObject<THREE.Vector3>;
	previousModeRef: MutableRefObject<string | undefined>;
	previousTrackedPlayerPositionRef: MutableRefObject<Vector3Tuple | null>;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	topDownOrbitRef: RefObject<OrbitControlsHandle | null>;
};

type ResolveCameraRigFrameFlagsInput = {
	mode: CameraStateSnapshot["mode"];
	previousMode: string | undefined;
	needsFreeOrbitalSync: boolean;
	needsThirdPersonSync: boolean;
	isUserInteracting: boolean;
	trackedPlayerPosition: Vector3Tuple;
	previousTrackedPlayerPosition: Vector3Tuple | null;
};

type CameraRigFrameFlags = {
	isModeChange: boolean;
	isFreeOrbitalJump: boolean;
	isThirdPersonJump: boolean;
	transitionAlpha: number;
};

export const runCameraRigFrameUpdate = (
	input: CameraRigFrameUpdateInput,
): void => {
	if (!input.cameraStateSnapshot) {
		return;
	}

	const trackedPlayerPosition = resolveTrackedPlayerPosition({
		playerSpawnPosition: input.playerSpawnPosition,
	});
	const targets = getCameraRigTargets({
		mode: input.cameraStateSnapshot.mode,
		playerPosition: trackedPlayerPosition,
		isDesktopLayout: input.isDesktopLayout,
	});
	const flags = resolveCameraRigFrameFlags({
		mode: input.cameraStateSnapshot.mode,
		previousMode: input.previousModeRef.current,
		needsFreeOrbitalSync: input.needsFreeOrbitalSyncRef.current,
		needsThirdPersonSync: input.needsThirdPersonSyncRef.current,
		isUserInteracting: input.isUserInteractingRef.current,
		trackedPlayerPosition,
		previousTrackedPlayerPosition:
			input.previousTrackedPlayerPositionRef.current,
	});

	input.previousModeRef.current = input.cameraStateSnapshot.mode;

	if (input.cameraStateSnapshot.mode === CAMERA_MODES.TOP_DOWN) {
		applyTopDownFrame({
			camera: input.camera,
			flags,
			lookAt: targets.lookAt,
			needsTopDownSyncRef: input.needsTopDownSyncRef,
			position: targets.position,
			topDownOrbitRef: input.topDownOrbitRef,
		});
	} else if (input.cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON) {
		applyFirstPersonFrame({
			camera: input.camera,
			firstPersonOrbitRef: input.firstPersonOrbitRef,
			firstPersonTargetVectorRef: input.firstPersonTargetVectorRef,
			flags,
			isDesktopLayout: input.isDesktopLayout,
			needsFirstPersonSyncRef: input.needsFirstPersonSyncRef,
			pointerLockRef: input.pointerLockRef,
			position: targets.position,
			positionVectorRef: input.positionVectorRef,
		});
	} else if (input.cameraStateSnapshot.mode === CAMERA_MODES.THIRD_PERSON) {
		applyThirdPersonFrame({
			camera: input.camera,
			flags,
			isUserInteracting: input.isUserInteractingRef.current,
			lastTransition: input.lastTransition,
			lookAt: targets.lookAt,
			lookAtVectorRef: input.lookAtVectorRef,
			needsThirdPersonSyncRef: input.needsThirdPersonSyncRef,
			position: targets.position,
			positionVectorRef: input.positionVectorRef,
			previousTrackedPlayerPosition:
				input.previousTrackedPlayerPositionRef.current,
			thirdPersonOrbitRef: input.thirdPersonOrbitRef,
			trackedPlayerPosition,
		});
	} else {
		applyFreeOrbitalFrame({
			camera: input.camera,
			flags,
			freeOrbitalOrbitRef: input.freeOrbitalOrbitRef,
			lastTransition: input.lastTransition,
			lookAt: targets.lookAt,
			needsFreeOrbitalSyncRef: input.needsFreeOrbitalSyncRef,
			position: targets.position,
		});
	}

	if (
		checkShouldSyncMovementAzimuth({
			isModeChange: flags.isModeChange,
			isUserInteracting: input.isUserInteractingRef.current,
			mode: input.cameraStateSnapshot.mode,
			needsFreeOrbitalSync: input.needsFreeOrbitalSyncRef.current,
		})
	) {
		syncMovementAzimuth({
			camera: input.camera,
			cameraStateSnapshot: input.cameraStateSnapshot,
			directionRef: input.directionRef,
		});
	}

	updatePerspectiveFov({
		camera: input.camera,
		cameraStateSnapshot: input.cameraStateSnapshot,
		transitionAlpha: flags.transitionAlpha,
	});

	input.previousTrackedPlayerPositionRef.current = [...trackedPlayerPosition];
};

export type {
	CameraRigFrameFlags,
	CameraRigFrameUpdateInput,
	PointerLockControlsHandle,
	ResolveCameraRigFrameFlagsInput,
};
export { checkShouldSyncMovementAzimuth, resolveCameraRigFrameFlags };
