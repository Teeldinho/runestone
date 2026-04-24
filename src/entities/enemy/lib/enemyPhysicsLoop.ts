import type * as THREE from "three";

import { getQuaternionFromXZ, type Vector3Tuple } from "@/shared/lib";

type EnemyFrameLinearVelocity = {
	x: number;
	y: number;
	z: number;
};

type ComputeEnemyFrameLinearVelocityInput = {
	currentPosition: Vector3Tuple;
	currentVerticalVelocity: number;
	delta: number;
	nextPosition: Vector3Tuple;
};

type ShouldRotateEnemyInput = {
	movementThreshold: number;
	velocityX: number;
	velocityZ: number;
};

type CreateSmoothedEnemyRotationInput = {
	currentRotation: THREE.Quaternion;
	delta: number;
	rotationSpeed: number;
	velocityX: number;
	velocityZ: number;
};

export const computeEnemyFrameLinearVelocity = ({
	currentPosition,
	currentVerticalVelocity,
	delta,
	nextPosition,
}: ComputeEnemyFrameLinearVelocityInput): EnemyFrameLinearVelocity => {
	const [currentX, , currentZ] = currentPosition;
	const [nextX, , nextZ] = nextPosition;

	return {
		x: (nextX - currentX) / delta,
		y: currentVerticalVelocity,
		z: (nextZ - currentZ) / delta,
	};
};

export const shouldRotateEnemy = ({
	movementThreshold,
	velocityX,
	velocityZ,
}: ShouldRotateEnemyInput): boolean =>
	Math.abs(velocityX) > movementThreshold ||
	Math.abs(velocityZ) > movementThreshold;

export const createSmoothedEnemyRotation = ({
	currentRotation,
	delta,
	rotationSpeed,
	velocityX,
	velocityZ,
}: CreateSmoothedEnemyRotationInput): THREE.Quaternion =>
	currentRotation
		.clone()
		.slerp(getQuaternionFromXZ(velocityX, velocityZ), rotationSpeed * delta);

export type {
	ComputeEnemyFrameLinearVelocityInput,
	CreateSmoothedEnemyRotationInput,
	EnemyFrameLinearVelocity,
	ShouldRotateEnemyInput,
};
