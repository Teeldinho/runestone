import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ENEMY_MACHINE_STATES } from "../config";
import { useEnemyMovement } from "./useEnemyMovement";

const SPAWN_Y = 0.91;
const DELTA = 0.016;

describe("useEnemyMovement", () => {
	it("returns currentPosition unchanged when DEAD", () => {
		const current: [number, number, number] = [2, SPAWN_Y, 2];
		const { result } = renderHook(() =>
			useEnemyMovement({
				behaviorState: ENEMY_MACHINE_STATES.DEAD,
				playerPosition: [0, SPAWN_Y, 0],
				patrolCenter: [0, SPAWN_Y, 0],
			}),
		);
		const nextPos = result.current.getNextPosition(DELTA, current);
		expect(nextPos).toEqual(current);
	});

	it("returns currentPosition unchanged when ATTACK", () => {
		const current: [number, number, number] = [2, SPAWN_Y, 2];
		const { result } = renderHook(() =>
			useEnemyMovement({
				behaviorState: ENEMY_MACHINE_STATES.ATTACK,
				playerPosition: [0, SPAWN_Y, 0],
				patrolCenter: [0, SPAWN_Y, 0],
			}),
		);
		const nextPos = result.current.getNextPosition(DELTA, current);
		expect(nextPos).toEqual(current);
	});

	it("moves toward player when CHASE", () => {
		const current: [number, number, number] = [0, SPAWN_Y, 0];
		const player: [number, number, number] = [10, SPAWN_Y, 0];
		const { result } = renderHook(() =>
			useEnemyMovement({
				behaviorState: ENEMY_MACHINE_STATES.CHASE,
				playerPosition: player,
				patrolCenter: [0, SPAWN_Y, 0],
			}),
		);
		const nextPos = result.current.getNextPosition(DELTA, current);
		expect(nextPos[0]).toBeGreaterThan(current[0]);
		expect(nextPos[1]).toBe(SPAWN_Y);
	});

	it("moves during patrol state", () => {
		const current: [number, number, number] = [0, SPAWN_Y, 0];
		const { result } = renderHook(() =>
			useEnemyMovement({
				behaviorState: ENEMY_MACHINE_STATES.PATROL,
				playerPosition: [0, SPAWN_Y, 0],
				patrolCenter: [0, SPAWN_Y, 0],
			}),
		);
		const nextPos = result.current.getNextPosition(DELTA, current);
		const moved =
			nextPos[0] !== current[0] ||
			nextPos[2] !== current[2];
		expect(moved).toBe(true);
	});
});
