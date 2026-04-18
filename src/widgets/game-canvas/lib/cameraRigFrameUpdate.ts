import type { MutableRefObject, RefObject } from "react";
import * as THREE from "three";
import type { LastTransition } from "@/entities/dungeon";
import {
	CAMERA_MODES,
	type CameraStateSnapshot,
	resolveCameraAzimuth,
} from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import {
	getPlayerPosition,
	hasPlayerPosition,
	setCameraAzimuth,
} from "@/shared/lib";

import {
	CAMERA_RIG_CAMERA_UP,
	CAMERA_RIG_FIRST_PERSON_LOOK_AHEAD_DISTANCE,
	CAMERA_RIG_FIRST_PERSON_TARGET_DISTANCE,
	CAMERA_RIG_FOV_EPSILON,
	CAMERA_RIG_FREE_ORBITAL_RECENTER_DISTANCE,
	CAMERA_RIG_LERP_ALPHA,
	CAMERA_RIG_TRANSITION_JUMP_DISTANCE,
} from "../config";
import type { OrbitControlsHandle } from "./cameraRigControls";
import { setCameraUp, setOrbitTarget } from "./cameraRigControls";
import {
	checkOrbitFollowJump,
	getPreservedOrbitCameraPosition,
} from "./cameraRigFollow";
import {
	getCameraRigTargets,
	getThirdPersonTransitionTargets,
} from "./cameraRigTargets";

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

const getTrackedPlayerPosition = (
	playerSpawnPosition: Vector3Tuple,
): Vector3Tuple => {
	return hasPlayerPosition() ? getPlayerPosition() : playerSpawnPosition;
};

const setFirstPersonOrbitTargetFromCamera = ({
	camera,
	firstPersonTargetVectorRef,
}: Pick<
	CameraRigFrameUpdateInput,
	"camera" | "firstPersonTargetVectorRef"
>): void => {
	camera.getWorldDirection(firstPersonTargetVectorRef.current);
	firstPersonTargetVectorRef.current
		.multiplyScalar(CAMERA_RIG_FIRST_PERSON_TARGET_DISTANCE)
		.add(camera.position);
};

const toVector3Tuple = (vector: THREE.Vector3): Vector3Tuple => {
	return [vector.x, vector.y, vector.z];
};

const resolveOrbitFollowTarget = ({
	camera,
	currentTarget,
	nextTarget,
}: {
	camera: THREE.Camera;
	currentTarget: THREE.Vector3;
	nextTarget: Vector3Tuple;
}): Vector3Tuple => {
	return getPreservedOrbitCameraPosition({
		cameraPosition: [camera.position.x, camera.position.y, camera.position.z],
		currentTarget: toVector3Tuple(currentTarget),
		nextTarget,
	});
};

const applyTopDownFrame = ({
	camera,
	lookAt,
	position,
	flags,
	needsTopDownSyncRef,
	topDownOrbitRef,
}: {
	camera: THREE.Camera;
	lookAt: Vector3Tuple;
	position: Vector3Tuple;
	flags: CameraRigFrameFlags;
	needsTopDownSyncRef: MutableRefObject<boolean>;
	topDownOrbitRef: RefObject<OrbitControlsHandle | null>;
}): void => {
	setCameraUp(camera, CAMERA_RIG_CAMERA_UP.TOP_DOWN);

	if (!topDownOrbitRef.current) {
		if (flags.isModeChange) {
			camera.position.set(...position);
			camera.lookAt(...lookAt);
		}
		return;
	}

	if (needsTopDownSyncRef.current) {
		camera.position.set(...position);
		setOrbitTarget(topDownOrbitRef.current, lookAt);
		needsTopDownSyncRef.current = false;
		return;
	}

	topDownOrbitRef.current.target.set(...lookAt);
};

const applyFirstPersonMobileOrbitFrame = ({
	camera,
	firstPersonOrbitRef,
	firstPersonTargetVectorRef,
	flags,
	needsFirstPersonSyncRef,
	position,
}: {
	camera: THREE.Camera;
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	firstPersonTargetVectorRef: MutableRefObject<THREE.Vector3>;
	flags: CameraRigFrameFlags;
	needsFirstPersonSyncRef: MutableRefObject<boolean>;
	position: Vector3Tuple;
}): void => {
	if (!firstPersonOrbitRef.current) {
		return;
	}

	camera.position.set(...position);
	setFirstPersonOrbitTargetFromCamera({
		camera,
		firstPersonTargetVectorRef,
	});

	if (needsFirstPersonSyncRef.current || flags.isModeChange) {
		setOrbitTarget(firstPersonOrbitRef.current, [
			firstPersonTargetVectorRef.current.x,
			firstPersonTargetVectorRef.current.y,
			firstPersonTargetVectorRef.current.z,
		]);
		needsFirstPersonSyncRef.current = false;
		return;
	}

	firstPersonOrbitRef.current.target.copy(firstPersonTargetVectorRef.current);
};

const applyFirstPersonDesktopFrame = ({
	camera,
	flags,
	pointerLockRef,
	position,
	positionVectorRef,
}: {
	camera: THREE.Camera;
	flags: CameraRigFrameFlags;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	position: Vector3Tuple;
	positionVectorRef: MutableRefObject<THREE.Vector3>;
}): void => {
	positionVectorRef.current.set(...position);
	camera.position.lerp(positionVectorRef.current, flags.transitionAlpha);

	if (!pointerLockRef.current?.isLocked) {
		camera.lookAt(
			camera.position.x,
			camera.position.y,
			camera.position.z + CAMERA_RIG_FIRST_PERSON_LOOK_AHEAD_DISTANCE,
		);
	}
};

const applyFirstPersonFrame = ({
	camera,
	firstPersonOrbitRef,
	firstPersonTargetVectorRef,
	flags,
	isDesktopLayout,
	needsFirstPersonSyncRef,
	pointerLockRef,
	position,
	positionVectorRef,
}: {
	camera: THREE.Camera;
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	firstPersonTargetVectorRef: MutableRefObject<THREE.Vector3>;
	flags: CameraRigFrameFlags;
	isDesktopLayout: boolean;
	needsFirstPersonSyncRef: MutableRefObject<boolean>;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	position: Vector3Tuple;
	positionVectorRef: MutableRefObject<THREE.Vector3>;
}): void => {
	setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);

	if (!isDesktopLayout && firstPersonOrbitRef.current) {
		applyFirstPersonMobileOrbitFrame({
			camera,
			firstPersonOrbitRef,
			firstPersonTargetVectorRef,
			flags,
			needsFirstPersonSyncRef,
			position,
		});
		return;
	}

	applyFirstPersonDesktopFrame({
		camera,
		flags,
		pointerLockRef,
		position,
		positionVectorRef,
	});
};

const applyThirdPersonFrame = ({
	camera,
	flags,
	isUserInteracting,
	lastTransition,
	lookAt,
	lookAtVectorRef,
	needsThirdPersonSyncRef,
	position,
	positionVectorRef,
	thirdPersonOrbitRef,
	trackedPlayerPosition,
}: {
	camera: THREE.Camera;
	flags: CameraRigFrameFlags;
	isUserInteracting: boolean;
	lastTransition: LastTransition | null;
	lookAt: Vector3Tuple;
	lookAtVectorRef: MutableRefObject<THREE.Vector3>;
	needsThirdPersonSyncRef: MutableRefObject<boolean>;
	position: Vector3Tuple;
	positionVectorRef: MutableRefObject<THREE.Vector3>;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	trackedPlayerPosition: Vector3Tuple;
}): void => {
	setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);

	if (!thirdPersonOrbitRef.current) {
		if (flags.isModeChange) {
			camera.position.set(...position);
		}
		return;
	}

	if (needsThirdPersonSyncRef.current) {
		camera.position.set(...position);
		setOrbitTarget(thirdPersonOrbitRef.current, lookAt);
		needsThirdPersonSyncRef.current = false;
		return;
	}

	if (flags.isThirdPersonJump) {
		const transitionTargets = lastTransition
			? getThirdPersonTransitionTargets({
					doorSide: lastTransition.doorSide,
					playerPosition: trackedPlayerPosition,
				})
			: { position, lookAt };

		camera.position.set(...transitionTargets.position);
		setOrbitTarget(thirdPersonOrbitRef.current, transitionTargets.lookAt);
		thirdPersonOrbitRef.current.update();
		return;
	}

	if (isUserInteracting) {
		thirdPersonOrbitRef.current.target.set(...lookAt);
		return;
	}

	const desiredCameraPosition = getPreservedOrbitCameraPosition({
		cameraPosition: camera.position.toArray() as Vector3Tuple,
		currentTarget: thirdPersonOrbitRef.current.target.toArray() as Vector3Tuple,
		nextTarget: lookAt,
	});

	lookAtVectorRef.current.set(...lookAt);
	positionVectorRef.current.set(...desiredCameraPosition);

	thirdPersonOrbitRef.current.target.lerp(
		lookAtVectorRef.current,
		CAMERA_RIG_LERP_ALPHA,
	);
	camera.position.lerp(positionVectorRef.current, CAMERA_RIG_LERP_ALPHA);
	thirdPersonOrbitRef.current.update();
};

const applyFreeOrbitalFrame = ({
	camera,
	flags,
	freeOrbitalOrbitRef,
	lastTransition,
	lookAt,
	needsFreeOrbitalSyncRef,
	position,
}: {
	camera: THREE.Camera;
	flags: CameraRigFrameFlags;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	lastTransition: LastTransition | null;
	lookAt: Vector3Tuple;
	needsFreeOrbitalSyncRef: MutableRefObject<boolean>;
	position: Vector3Tuple;
}): void => {
	if (!freeOrbitalOrbitRef.current) {
		if (flags.isModeChange) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);
			camera.position.set(...position);
		}
		return;
	}

	if (needsFreeOrbitalSyncRef.current) {
		setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);
		camera.position.set(...position);
		setOrbitTarget(freeOrbitalOrbitRef.current, lookAt);
		needsFreeOrbitalSyncRef.current = false;
		return;
	}

	if (!flags.isFreeOrbitalJump) {
		return;
	}

	setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);

	if (lastTransition === null) {
		camera.position.set(...position);
		setOrbitTarget(freeOrbitalOrbitRef.current, lookAt);
	} else {
		const desiredCameraPosition = resolveOrbitFollowTarget({
			camera,
			currentTarget: freeOrbitalOrbitRef.current.target,
			nextTarget: lookAt,
		});

		camera.position.set(...desiredCameraPosition);
		setOrbitTarget(freeOrbitalOrbitRef.current, lookAt);
	}

	freeOrbitalOrbitRef.current.update();
};

const syncMovementAzimuth = ({
	camera,
	cameraStateSnapshot,
	directionRef,
}: Pick<
	CameraRigFrameUpdateInput,
	"camera" | "cameraStateSnapshot" | "directionRef"
>): void => {
	if (!cameraStateSnapshot) {
		return;
	}

	camera.getWorldDirection(directionRef.current);
	const nextAzimuth = resolveCameraAzimuth({
		mode: cameraStateSnapshot.mode,
		direction: directionRef.current,
	});

	if (nextAzimuth !== null) {
		setCameraAzimuth(nextAzimuth);
	}
};

const updatePerspectiveFov = ({
	camera,
	cameraStateSnapshot,
	transitionAlpha,
}: {
	camera: THREE.Camera;
	cameraStateSnapshot: CameraStateSnapshot;
	transitionAlpha: number;
}): void => {
	if (!(camera instanceof THREE.PerspectiveCamera)) {
		return;
	}

	const fovDifference = Math.abs(camera.fov - cameraStateSnapshot.fov);

	if (fovDifference > CAMERA_RIG_FOV_EPSILON) {
		camera.fov += (cameraStateSnapshot.fov - camera.fov) * transitionAlpha;
		camera.updateProjectionMatrix();
	}
};

const resolveCameraRigFrameFlags = ({
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

const checkShouldSyncMovementAzimuth = ({
	isModeChange,
	isUserInteracting,
	mode,
	needsFreeOrbitalSync,
}: {
	isModeChange: boolean;
	isUserInteracting: boolean;
	mode: CameraStateSnapshot["mode"];
	needsFreeOrbitalSync: boolean;
}): boolean => {
	if (mode !== CAMERA_MODES.FREE_ORBITAL) {
		return true;
	}

	return isModeChange || needsFreeOrbitalSync || isUserInteracting;
};

export const runCameraRigFrameUpdate = (
	input: CameraRigFrameUpdateInput,
): void => {
	if (!input.cameraStateSnapshot) {
		return;
	}

	const trackedPlayerPosition = getTrackedPlayerPosition(
		input.playerSpawnPosition,
	);
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
			lookAt: targets.lookAt,
			position: targets.position,
			flags,
			needsTopDownSyncRef: input.needsTopDownSyncRef,
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
