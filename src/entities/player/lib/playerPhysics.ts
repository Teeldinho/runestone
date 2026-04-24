import type * as THREE from "three";

import { type CameraMode, RELATIVE_CAMERA_MODES } from "@/shared/config";
import { getQuaternionFromXZ, type Vector3Tuple } from "@/shared/lib";

import { PLAYER_ENTITY_CONFIG } from "../config";

import {
	normalizeMovementVelocity,
	rotateVelocityByCameraAzimuth,
} from "./playerMovement";

type ResolvePlayerPhysicsTeleportTranslationInput = Vector3Tuple;

type ResolvePlayerPhysicsLinearVelocityInput = {
	cameraAzimuth: number;
	cameraMode: CameraMode | string;
	isSprinting: boolean;
	velocity: Vector3Tuple;
};

type PlayerPhysicsLinearVelocity = {
	horizontalVelocity: Vector3Tuple;
	isMoving: boolean;
	rotationTarget: THREE.Quaternion | null;
};

type CreateSmoothedPlayerPhysicsRotationInput = {
	currentRotation: THREE.Quaternion;
	delta: number;
	rotationTarget: THREE.Quaternion;
};

type PlayerPhysicsTeleportTranslation = {
	x: number;
	y: number;
	z: number;
};

export const resolvePlayerPhysicsTeleportTranslation = (
	teleportTarget: ResolvePlayerPhysicsTeleportTranslationInput,
): PlayerPhysicsTeleportTranslation => {
	const [x, y, z] = teleportTarget;

	return { x, y, z };
};

export const resolvePlayerPhysicsLinearVelocity = ({
	cameraAzimuth,
	cameraMode,
	isSprinting,
	velocity,
}: ResolvePlayerPhysicsLinearVelocityInput): PlayerPhysicsLinearVelocity => {
	const normalizedVelocity = normalizeMovementVelocity(velocity);
	const isMoving = normalizedVelocity[0] !== 0 || normalizedVelocity[2] !== 0;

	if (!isMoving) {
		return {
			horizontalVelocity: [0, 0, 0],
			isMoving: false,
			rotationTarget: null,
		};
	}

	const speed = isSprinting
		? PLAYER_ENTITY_CONFIG.MOVEMENT.SPRINT_SPEED
		: PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED;
	const isRelativeMode = RELATIVE_CAMERA_MODES.includes(
		cameraMode as CameraMode,
	);
	const [resolvedX, , resolvedZ] = isRelativeMode
		? rotateVelocityByCameraAzimuth(normalizedVelocity, cameraAzimuth)
		: normalizedVelocity;
	const horizontalVelocity: Vector3Tuple = [
		resolvedX * speed,
		0,
		resolvedZ * speed,
	];

	return {
		horizontalVelocity,
		isMoving: true,
		rotationTarget: getQuaternionFromXZ(
			horizontalVelocity[0],
			horizontalVelocity[2],
		),
	};
};

export const createSmoothedPlayerPhysicsRotation = ({
	currentRotation,
	delta,
	rotationTarget,
}: CreateSmoothedPlayerPhysicsRotationInput): THREE.Quaternion =>
	currentRotation
		.clone()
		.slerp(
			rotationTarget,
			PLAYER_ENTITY_CONFIG.MOVEMENT.ROTATION_SPEED * delta,
		);

export type {
	CreateSmoothedPlayerPhysicsRotationInput,
	PlayerPhysicsLinearVelocity,
	PlayerPhysicsTeleportTranslation,
	ResolvePlayerPhysicsLinearVelocityInput,
	ResolvePlayerPhysicsTeleportTranslationInput,
};
