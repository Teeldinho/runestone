import type { MutableRefObject, RefObject } from "react";
import type * as THREE from "three";

import type { LastTransition } from "@/entities/dungeon";
import type { Vector3Tuple } from "@/shared/lib";
import {
	CAMERA_RIG_CAMERA_UP,
	CAMERA_RIG_EULER_ORDERS,
	CAMERA_RIG_FIRST_PERSON_LOOK_AHEAD_DISTANCE,
	CAMERA_RIG_LERP_ALPHA,
} from "../config";
import type { OrbitControlsHandle } from "./cameraRigControls";
import { setCameraUp, setOrbitTarget } from "./cameraRigControls";
import { getPreservedOrbitCameraPosition } from "./cameraRigFollow";
import type {
	CameraRigFrameFlags,
	PointerLockControlsHandle,
} from "./cameraRigFrameUpdate";
import { getThirdPersonTransitionTargets } from "./cameraRigTargets";

type ApplyTopDownFrameInput = {
	camera: THREE.Camera;
	flags: CameraRigFrameFlags;
	lookAt: Vector3Tuple;
	needsTopDownSyncRef: MutableRefObject<boolean>;
	position: Vector3Tuple;
	topDownOrbitRef: RefObject<OrbitControlsHandle | null>;
};

type ApplyFirstPersonFrameInput = {
	camera: THREE.Camera;
	flags: CameraRigFrameFlags;
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	firstPersonTargetVectorRef: MutableRefObject<THREE.Vector3>;
	isDesktopLayout: boolean;
	needsFirstPersonSyncRef: MutableRefObject<boolean>;
	pitch: number;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	position: Vector3Tuple;
	positionVectorRef: MutableRefObject<THREE.Vector3>;
	yaw: number;
};

type ApplyThirdPersonFrameInput = {
	camera: THREE.Camera;
	flags: CameraRigFrameFlags;
	isUserInteracting: boolean;
	lastTransition: LastTransition | null;
	lookAt: Vector3Tuple;
	lookAtVectorRef: MutableRefObject<THREE.Vector3>;
	needsThirdPersonSyncRef: MutableRefObject<boolean>;
	position: Vector3Tuple;
	positionVectorRef: MutableRefObject<THREE.Vector3>;
	previousTrackedPlayerPosition: Vector3Tuple | null;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	trackedPlayerPosition: Vector3Tuple;
};

type ApplyFreeOrbitalFrameInput = {
	camera: THREE.Camera;
	flags: CameraRigFrameFlags;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	lastTransition: LastTransition | null;
	lookAt: Vector3Tuple;
	needsFreeOrbitalSyncRef: MutableRefObject<boolean>;
	position: Vector3Tuple;
};

const toVector3Tuple = (vector: THREE.Vector3): Vector3Tuple => [
	vector.x,
	vector.y,
	vector.z,
];

const resolveOrbitFollowTarget = ({
	camera,
	currentTarget,
	nextTarget,
}: {
	camera: THREE.Camera;
	currentTarget: THREE.Vector3;
	nextTarget: Vector3Tuple;
}): Vector3Tuple =>
	getPreservedOrbitCameraPosition({
		cameraPosition: [camera.position.x, camera.position.y, camera.position.z],
		currentTarget: toVector3Tuple(currentTarget),
		nextTarget,
	});

const translateOrbitByPlayerDelta = ({
	camera,
	currentTarget,
	previousTrackedPlayerPosition,
	trackedPlayerPosition,
}: {
	camera: THREE.Camera;
	currentTarget: THREE.Vector3;
	previousTrackedPlayerPosition: Vector3Tuple;
	trackedPlayerPosition: Vector3Tuple;
}): Vector3Tuple => {
	const deltaX = trackedPlayerPosition[0] - previousTrackedPlayerPosition[0];
	const deltaY = trackedPlayerPosition[1] - previousTrackedPlayerPosition[1];
	const deltaZ = trackedPlayerPosition[2] - previousTrackedPlayerPosition[2];

	camera.position.set(
		camera.position.x + deltaX,
		camera.position.y + deltaY,
		camera.position.z + deltaZ,
	);

	return [
		currentTarget.x + deltaX,
		currentTarget.y + deltaY,
		currentTarget.z + deltaZ,
	];
};

const applyFirstPersonDesktopFrame = ({
	camera,
	flags,
	pointerLockRef,
	position,
	positionVectorRef,
}: Pick<
	ApplyFirstPersonFrameInput,
	"camera" | "flags" | "pointerLockRef" | "position" | "positionVectorRef"
>): void => {
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

export const applyTopDownFrame = ({
	camera,
	lookAt,
	position,
	flags,
	needsTopDownSyncRef,
	topDownOrbitRef,
}: ApplyTopDownFrameInput): void => {
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

const applyFirstPersonMobileLookFrame = ({
	camera,
	pitch,
	position,
	yaw,
}: {
	readonly camera: THREE.Camera;
	readonly pitch: number;
	readonly position: Vector3Tuple;
	readonly yaw: number;
}): void => {
	camera.position.set(...position);
	camera.rotation.set(
		pitch,
		yaw,
		0,
		CAMERA_RIG_EULER_ORDERS.FIRST_PERSON_MOBILE,
	);
};

export const applyFirstPersonFrame = ({
	camera,
	flags,
	isDesktopLayout,
	pitch,
	pointerLockRef,
	position,
	positionVectorRef,
	yaw,
}: ApplyFirstPersonFrameInput): void => {
	setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);

	if (!isDesktopLayout) {
		applyFirstPersonMobileLookFrame({
			camera,
			pitch,
			position,
			yaw,
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

export const applyThirdPersonFrame = ({
	camera,
	flags,
	isUserInteracting,
	lastTransition,
	lookAt,
	lookAtVectorRef,
	needsThirdPersonSyncRef,
	position,
	positionVectorRef,
	previousTrackedPlayerPosition,
	thirdPersonOrbitRef,
	trackedPlayerPosition,
}: ApplyThirdPersonFrameInput): void => {
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
		if (previousTrackedPlayerPosition === null) {
			const desiredCameraPosition = resolveOrbitFollowTarget({
				camera,
				currentTarget: thirdPersonOrbitRef.current.target,
				nextTarget: lookAt,
			});

			camera.position.set(...desiredCameraPosition);
			setOrbitTarget(thirdPersonOrbitRef.current, lookAt);
			return;
		}

		const nextTarget = translateOrbitByPlayerDelta({
			camera,
			currentTarget: thirdPersonOrbitRef.current.target,
			previousTrackedPlayerPosition,
			trackedPlayerPosition,
		});

		setOrbitTarget(thirdPersonOrbitRef.current, nextTarget);
		return;
	}

	const desiredCameraPosition = getPreservedOrbitCameraPosition({
		cameraPosition: camera.position.toArray() as [number, number, number],
		currentTarget: thirdPersonOrbitRef.current.target.toArray() as [
			number,
			number,
			number,
		],
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

export const applyFreeOrbitalFrame = ({
	camera,
	flags,
	freeOrbitalOrbitRef,
	lastTransition,
	lookAt,
	needsFreeOrbitalSyncRef,
	position,
}: ApplyFreeOrbitalFrameInput): void => {
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

export type {
	ApplyFirstPersonFrameInput,
	ApplyFreeOrbitalFrameInput,
	ApplyThirdPersonFrameInput,
	ApplyTopDownFrameInput,
};
