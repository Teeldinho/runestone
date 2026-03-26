import { describe, expect, it } from "vitest";

import { ENEMY_CONFIG } from "@/shared/config";
import { ENEMY_MACHINE_STATES } from "../config";
import { computeEnemyMovement } from "./computeEnemyMovement";

const DELTA = 0.016; // ~60fps frame

describe("computeEnemyMovement", () => {
	it("returns currentPosition unchanged when DEAD", () => {
		const current: [number, number, number] = [1, 0.91, 3];
		const result = computeEnemyMovement({
			behaviorState: ENEMY_MACHINE_STATES.DEAD,
			currentPosition: current,
			targetPosition: [5, 0.91, 5],
			delta: DELTA,
		});
		expect(result).toEqual(current);
	});

	it("returns currentPosition unchanged when ATTACK", () => {
		const current: [number, number, number] = [2, 0.91, 4];
		const result = computeEnemyMovement({
			behaviorState: ENEMY_MACHINE_STATES.ATTACK,
			currentPosition: current,
			targetPosition: [5, 0.91, 5],
			delta: DELTA,
		});
		expect(result).toEqual(current);
	});

	it("returns currentPosition unchanged when DETECT", () => {
		const current: [number, number, number] = [0, 0.91, 0];
		const result = computeEnemyMovement({
			behaviorState: ENEMY_MACHINE_STATES.DETECT,
			currentPosition: current,
			targetPosition: [5, 0.91, 5],
			delta: DELTA,
		});
		expect(result).toEqual(current);
	});

	it("moves toward target at patrol speed when PATROL", () => {
		const current: [number, number, number] = [0, 0.91, 0];
		const target: [number, number, number] = [10, 0.91, 0];
		const result = computeEnemyMovement({
			behaviorState: ENEMY_MACHINE_STATES.PATROL,
			currentPosition: current,
			targetPosition: target,
			delta: DELTA,
		});
		const expectedX = ENEMY_CONFIG.PATROL_SPEED * DELTA;
		expect(result[0]).toBeCloseTo(expectedX, 4);
		expect(result[1]).toBe(current[1]);
		expect(result[2]).toBe(current[2]);
	});

	it("moves toward target at chase speed when CHASE", () => {
		const current: [number, number, number] = [0, 0.91, 0];
		const target: [number, number, number] = [0, 0.91, 10];
		const result = computeEnemyMovement({
			behaviorState: ENEMY_MACHINE_STATES.CHASE,
			currentPosition: current,
			targetPosition: target,
			delta: DELTA,
		});
		const expectedZ = ENEMY_CONFIG.CHASE_SPEED * DELTA;
		expect(result[0]).toBe(current[0]);
		expect(result[1]).toBe(current[1]);
		expect(result[2]).toBeCloseTo(expectedZ, 4);
	});

	it("does not overshoot — clamps to target when closer than one step", () => {
		const current: [number, number, number] = [0, 0.91, 0];
		const target: [number, number, number] = [0.001, 0.91, 0];
		const result = computeEnemyMovement({
			behaviorState: ENEMY_MACHINE_STATES.CHASE,
			currentPosition: current,
			targetPosition: target,
			delta: 1.0,
		});
		expect(result[0]).toBeCloseTo(0.001, 4);
		expect(result[2]).toBe(current[2]);
	});

	it("keeps Y coordinate unchanged during movement", () => {
		const spawnY = 0.91;
		const current: [number, number, number] = [0, spawnY, 0];
		const target: [number, number, number] = [5, spawnY, 5];
		const result = computeEnemyMovement({
			behaviorState: ENEMY_MACHINE_STATES.PATROL,
			currentPosition: current,
			targetPosition: target,
			delta: DELTA,
		});
		expect(result[1]).toBe(spawnY);
	});
});
