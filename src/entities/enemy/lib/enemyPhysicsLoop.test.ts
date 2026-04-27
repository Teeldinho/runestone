import * as THREE from "three";
import { describe, expect, it } from "vitest";

import { getQuaternionFromXZ } from "@/shared/lib";

import {
	computeEnemyFrameLinearVelocity,
	createSmoothedEnemyRotation,
	resolveEnemyPhysicsFrameMotion,
	resolveEnemyPlayerPositionSync,
	shouldRotateEnemy,
} from "./enemyPhysicsLoop";

describe("enemyPhysicsLoop", () => {
	it("computes frame linear velocity from the current and next positions", () => {
		expect(
			computeEnemyFrameLinearVelocity({
				currentPosition: [10, 0.91, 5],
				currentVerticalVelocity: 0.75,
				delta: 0.2,
				nextPosition: [13, 0.91, 9],
			}),
		).toEqual({
			x: 15,
			y: 0.75,
			z: 20,
		});
	});

	it("only rotates when movement crosses the configured threshold", () => {
		expect(
			shouldRotateEnemy({
				movementThreshold: 0.01,
				velocityX: 0.009,
				velocityZ: 0.008,
			}),
		).toBe(false);

		expect(
			shouldRotateEnemy({
				movementThreshold: 0.01,
				velocityX: 0.012,
				velocityZ: 0.008,
			}),
		).toBe(true);
	});

	it("creates a smoothed rotation toward the movement direction", () => {
		const currentRotation = new THREE.Quaternion();
		const targetRotation = getQuaternionFromXZ(1, 0);

		const smoothedRotation = createSmoothedEnemyRotation({
			currentRotation,
			delta: 1,
			rotationSpeed: 1,
			velocityX: 1,
			velocityZ: 0,
		});

		expect(smoothedRotation).not.toBe(currentRotation);
		expect(smoothedRotation.x).toBeCloseTo(targetRotation.x, 8);
		expect(smoothedRotation.y).toBeCloseTo(targetRotation.y, 8);
		expect(smoothedRotation.z).toBeCloseTo(targetRotation.z, 8);
		expect(smoothedRotation.w).toBeCloseTo(targetRotation.w, 8);
	});

	it("resolves enemy player-position sync state across frames", () => {
		const firstSync = resolveEnemyPlayerPositionSync({
			currentElapsedSincePlayerSyncMs: 0,
			currentLastPlayerPosition: [0, 0.91, 0],
			delta: 0.05,
			nextPlayerPosition: [0.1, 0.91, 0],
			positionThreshold: 0.35,
			updateIntervalMs: 120,
		});

		expect(firstSync.shouldSendPlayerPositionUpdate).toBe(false);
		expect(firstSync.nextElapsedSincePlayerSyncMs).toBe(50);
		expect(firstSync.nextLastPlayerPosition).toEqual([0, 0.91, 0]);

		const secondSync = resolveEnemyPlayerPositionSync({
			currentElapsedSincePlayerSyncMs: firstSync.nextElapsedSincePlayerSyncMs,
			currentLastPlayerPosition: firstSync.nextLastPlayerPosition,
			delta: 0.07,
			nextPlayerPosition: [0.5, 0.91, 0],
			positionThreshold: 0.35,
			updateIntervalMs: 120,
		});

		expect(secondSync.shouldSendPlayerPositionUpdate).toBe(true);
		expect(secondSync.nextElapsedSincePlayerSyncMs).toBe(0);
		expect(secondSync.nextLastPlayerPosition).toEqual([0.5, 0.91, 0]);
	});

	it("resolves frame motion updates for enemy rigid bodies", () => {
		const frameMotion = resolveEnemyPhysicsFrameMotion({
			currentPosition: [10, 0.91, 5],
			currentRotation: new THREE.Quaternion(),
			currentVerticalVelocity: 0.75,
			delta: 0.2,
			movementThreshold: 0.01,
			nextPosition: [13, 0.91, 9],
			rotationSpeed: 1,
		});

		expect(frameMotion.frameLinearVelocity).toEqual({
			x: 15,
			y: 0.75,
			z: 20,
		});
		expect(frameMotion.nextRotation).not.toBeNull();
		expect(frameMotion.nextRotation).toBeInstanceOf(THREE.Quaternion);
	});

	it("skips rotation updates when movement stays under the threshold", () => {
		const frameMotion = resolveEnemyPhysicsFrameMotion({
			currentPosition: [10, 0.91, 5],
			currentRotation: new THREE.Quaternion(),
			currentVerticalVelocity: 0.75,
			delta: 0.2,
			movementThreshold: 0.5,
			nextPosition: [10.001, 0.91, 5.001],
			rotationSpeed: 1,
		});

		expect(frameMotion.nextRotation).toBeNull();
	});
});
