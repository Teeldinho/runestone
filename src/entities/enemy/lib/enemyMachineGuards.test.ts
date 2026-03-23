import { describe, expect, it } from "vitest";

import {
	checkIsLethalDamageForEnemy,
	checkIsPlayerInAttackRange,
	checkIsPlayerInDetectionRange,
} from "./enemyMachineGuards";

const DETECTION_RADIUS = 7;
const ATTACK_RADIUS = 1.5;

describe("checkIsPlayerInDetectionRange", () => {
	it("returns true when player is within detection radius", () => {
		expect(
			checkIsPlayerInDetectionRange([0, 0, 0], [3, 0, 0], DETECTION_RADIUS),
		).toBe(true);
	});

	it("returns true when player is exactly at detection radius boundary", () => {
		expect(
			checkIsPlayerInDetectionRange(
				[0, 0, 0],
				[DETECTION_RADIUS, 0, 0],
				DETECTION_RADIUS,
			),
		).toBe(true);
	});

	it("returns false when player is beyond detection radius", () => {
		expect(
			checkIsPlayerInDetectionRange(
				[0, 0, 0],
				[DETECTION_RADIUS + 0.1, 0, 0],
				DETECTION_RADIUS,
			),
		).toBe(false);
	});

	it("returns true when player is close in 3D space", () => {
		expect(
			checkIsPlayerInDetectionRange([5, 0, 5], [5, 0, 8], DETECTION_RADIUS),
		).toBe(true);
	});

	it("returns false when player is far in 3D space", () => {
		expect(
			checkIsPlayerInDetectionRange([0, 0, 0], [10, 0, 10], DETECTION_RADIUS),
		).toBe(false);
	});

	it("returns true when enemy and player are at the same position", () => {
		expect(
			checkIsPlayerInDetectionRange([3, 0, 3], [3, 0, 3], DETECTION_RADIUS),
		).toBe(true);
	});
});

describe("checkIsPlayerInAttackRange", () => {
	it("returns true when player is within attack radius", () => {
		expect(
			checkIsPlayerInAttackRange([0, 0, 0], [1, 0, 0], ATTACK_RADIUS),
		).toBe(true);
	});

	it("returns true when player is exactly at attack radius boundary", () => {
		expect(
			checkIsPlayerInAttackRange(
				[0, 0, 0],
				[ATTACK_RADIUS, 0, 0],
				ATTACK_RADIUS,
			),
		).toBe(true);
	});

	it("returns false when player is beyond attack radius", () => {
		expect(
			checkIsPlayerInAttackRange(
				[0, 0, 0],
				[ATTACK_RADIUS + 0.1, 0, 0],
				ATTACK_RADIUS,
			),
		).toBe(false);
	});

	it("returns false when player is in detection range but not attack range", () => {
		expect(
			checkIsPlayerInAttackRange([0, 0, 0], [5, 0, 0], ATTACK_RADIUS),
		).toBe(false);
	});
});

describe("checkIsLethalDamageForEnemy", () => {
	it("returns true when damage equals remaining hp", () => {
		expect(checkIsLethalDamageForEnemy(45, 45)).toBe(true);
	});

	it("returns true when damage exceeds remaining hp", () => {
		expect(checkIsLethalDamageForEnemy(45, 60)).toBe(true);
	});

	it("returns false when damage is less than remaining hp", () => {
		expect(checkIsLethalDamageForEnemy(45, 20)).toBe(false);
	});

	it("returns false when damage is zero", () => {
		expect(checkIsLethalDamageForEnemy(45, 0)).toBe(false);
	});

	it("returns true when hp is already zero", () => {
		expect(checkIsLethalDamageForEnemy(0, 0)).toBe(true);
	});
});
