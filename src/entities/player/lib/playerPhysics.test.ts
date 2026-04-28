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

	it("maps top-down forward input to forward world velocity", () => {
		const result = resolvePlayerPhysicsLinearVelocity({
			cameraAzimuth: 0,
			cameraMode: CAMERA_MODES.TOP_DOWN,
			isSprinting: false,
			velocity: [0, 0, -1],
		});

		expect(result.isMoving).toBe(true);
		expect(result.horizontalVelocity[0]).toBeCloseTo(0, 6);
		expect(result.horizontalVelocity[1]).toBe(0);
		expect(result.horizontalVelocity[2]).toBeCloseTo(
			PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED,
			6,
		);
	});

	it("creates a smoothed rotation from a rotation-like object and target quaternion", () => {
		const currentRotation = { x: 0, y: 0, z: 0, w: 1 };
		const targetRotation = getQuaternionFromXZ(1, 0);

		const nextRotation = createSmoothedPlayerPhysicsRotation({
			currentRotation,
			delta: 0.05,
			rotationTarget: targetRotation,
		});

		expect(nextRotation).toBeInstanceOf(THREE.Quaternion);
		expect(
			nextRotation.equals(
				new THREE.Quaternion(
					currentRotation.x,
					currentRotation.y,
					currentRotation.z,
					currentRotation.w,
				).slerp(
					targetRotation,
					PLAYER_ENTITY_CONFIG.MOVEMENT.ROTATION_SPEED * 0.05,
				),
			),
		).toBe(true);
	});
});
