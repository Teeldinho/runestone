import * as THREE from "three";
import { describe, expect, it } from "vitest";

import { getQuaternionFromXZ } from "@/shared/lib";

import {
	computeEnemyFrameLinearVelocity,
	createSmoothedEnemyRotation,
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
});
