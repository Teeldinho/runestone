// @vitest-environment happy-dom

import * as THREE from "three";
import { describe, expect, it } from "vitest";

import { CAMERA_MODES } from "@/shared/config";
import { getQuaternionFromXZ } from "@/shared/lib";

import { PLAYER_ENTITY_CONFIG } from "../config";

import {
	createSmoothedPlayerPhysicsRotation,
	resolvePlayerPhysicsLinearVelocity,
	resolvePlayerPhysicsTeleportTranslation,
} from "./playerPhysics";

describe("playerPhysics", () => {
	it("maps a teleport target tuple to a rigid-body translation", () => {
		expect(resolvePlayerPhysicsTeleportTranslation([2, 1, -3])).toEqual({
			x: 2,
			y: 1,
			z: -3,
		});
	});

	it("resolves camera-relative sprint velocity and rotation target", () => {
		const result = resolvePlayerPhysicsLinearVelocity({
			cameraAzimuth: Math.PI / 2,
			cameraMode: CAMERA_MODES.FREE_ORBITAL,
			isSprinting: true,
			velocity: [0, 0, -1],
		});

		expect(result.isMoving).toBe(true);
		expect(result.horizontalVelocity).toEqual([
			PLAYER_ENTITY_CONFIG.MOVEMENT.SPRINT_SPEED,
			0,
			expect.closeTo(0, 6),
		]);
		expect(
			result.rotationTarget?.angleTo(
				getQuaternionFromXZ(PLAYER_ENTITY_CONFIG.MOVEMENT.SPRINT_SPEED, 0),
			),
		).toBeLessThan(0.01);
	});

	it("falls back to world-relative velocity and reports idle frames", () => {
		const movingResult = resolvePlayerPhysicsLinearVelocity({
			cameraAzimuth: 0,
			cameraMode: "spectator",
			isSprinting: false,
			velocity: [0, 0, -1],
		});

		expect(movingResult.isMoving).toBe(true);
		expect(movingResult.horizontalVelocity).toEqual([
			0,
			0,
			-PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED,
		]);

		const idleResult = resolvePlayerPhysicsLinearVelocity({
			cameraAzimuth: 0,
			cameraMode: CAMERA_MODES.TOP_DOWN,
			isSprinting: false,
			velocity: [0, 0, 0],
		});

		expect(idleResult.isMoving).toBe(false);
		expect(idleResult.horizontalVelocity).toEqual([0, 0, 0]);
		expect(idleResult.rotationTarget).toBeNull();
	});

	it("creates a smoothed rotation from the current and target quaternions", () => {
		const currentRotation = new THREE.Quaternion();
		const targetRotation = getQuaternionFromXZ(1, 0);

		const nextRotation = createSmoothedPlayerPhysicsRotation({
			currentRotation,
			delta: 0.05,
			rotationTarget: targetRotation,
		});

		expect(nextRotation).not.toBe(currentRotation);
		expect(
			nextRotation.equals(
				currentRotation
					.clone()
					.slerp(
						targetRotation,
						PLAYER_ENTITY_CONFIG.MOVEMENT.ROTATION_SPEED * 0.05,
					),
			),
		).toBe(true);
	});
});
