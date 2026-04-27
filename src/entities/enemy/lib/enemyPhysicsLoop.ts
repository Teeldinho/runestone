import type * as THREE from "three";

import { getQuaternionFromXZ, type Vector3Tuple } from "@/shared/lib";

import { computeSquaredDistance } from "./computeSquaredDistance";

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

type ResolveEnemyPlayerPositionSyncInput = {
	currentElapsedSincePlayerSyncMs: number;
	currentLastPlayerPosition: Vector3Tuple;
	delta: number;
	nextPlayerPosition: Vector3Tuple;
	positionThreshold: number;
	updateIntervalMs: number;
};

type ResolveEnemyPlayerPositionSyncResult = {
	nextElapsedSincePlayerSyncMs: number;
	nextLastPlayerPosition: Vector3Tuple;
	shouldSendPlayerPositionUpdate: boolean;
};

type ResolveEnemyPhysicsFrameMotionInput = {
	currentPosition: Vector3Tuple;
	currentRotation: THREE.Quaternion;
	currentVerticalVelocity: number;
	delta: number;
	movementThreshold: number;
	nextPosition: Vector3Tuple;
	rotationSpeed: number;
};

type ResolveEnemyPhysicsFrameMotionResult = {
	frameLinearVelocity: EnemyFrameLinearVelocity;
	nextRotation: THREE.Quaternion | null;
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

export const resolveEnemyPlayerPositionSync = ({
	currentElapsedSincePlayerSyncMs,
	currentLastPlayerPosition,
	delta,
	nextPlayerPosition,
	positionThreshold,
	updateIntervalMs,
}: ResolveEnemyPlayerPositionSyncInput): ResolveEnemyPlayerPositionSyncResult => {
	const nextElapsedSincePlayerSyncMs =
		currentElapsedSincePlayerSyncMs + delta * 1000;
	const hasPositionChangedEnough =
		computeSquaredDistance(currentLastPlayerPosition, nextPlayerPosition) >=
		positionThreshold * positionThreshold;
	const shouldSendPlayerPositionUpdate =
		nextElapsedSincePlayerSyncMs >= updateIntervalMs &&
		hasPositionChangedEnough;

	return {
		nextElapsedSincePlayerSyncMs: shouldSendPlayerPositionUpdate
			? 0
			: nextElapsedSincePlayerSyncMs,
		nextLastPlayerPosition: shouldSendPlayerPositionUpdate
			? nextPlayerPosition
			: currentLastPlayerPosition,
		shouldSendPlayerPositionUpdate,
	};
};

export const resolveEnemyPhysicsFrameMotion = ({
	currentPosition,
	currentRotation,
	currentVerticalVelocity,
	delta,
	movementThreshold,
	nextPosition,
	rotationSpeed,
}: ResolveEnemyPhysicsFrameMotionInput): ResolveEnemyPhysicsFrameMotionResult => {
	const frameLinearVelocity = computeEnemyFrameLinearVelocity({
		currentPosition,
		currentVerticalVelocity,
		delta,
		nextPosition,
	});

	if (
		!shouldRotateEnemy({
			movementThreshold,
			velocityX: frameLinearVelocity.x,
			velocityZ: frameLinearVelocity.z,
		})
	) {
		return {
			frameLinearVelocity,
			nextRotation: null,
		};
	}

	return {
		frameLinearVelocity,
		nextRotation: createSmoothedEnemyRotation({
			currentRotation,
			delta,
			rotationSpeed,
			velocityX: frameLinearVelocity.x,
			velocityZ: frameLinearVelocity.z,
		}),
	};
};

export type {
	ComputeEnemyFrameLinearVelocityInput,
	CreateSmoothedEnemyRotationInput,
	EnemyFrameLinearVelocity,
	ResolveEnemyPhysicsFrameMotionInput,
	ResolveEnemyPhysicsFrameMotionResult,
	ResolveEnemyPlayerPositionSyncInput,
	ResolveEnemyPlayerPositionSyncResult,
	ShouldRotateEnemyInput,
};
