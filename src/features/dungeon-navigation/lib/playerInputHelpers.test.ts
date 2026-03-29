import { describe, expect, it } from "vitest";

import { PLAYER_MOVEMENT_KEYS } from "@/entities/player";

import {
	computeVelocity,
	getMovementKey,
	isMovementKey,
} from "./playerInputHelpers";

describe("isMovementKey", () => {
	it("returns true for each WASD movement key", () => {
		expect(isMovementKey(PLAYER_MOVEMENT_KEYS.FORWARD)).toBe(true);
		expect(isMovementKey(PLAYER_MOVEMENT_KEYS.BACKWARD)).toBe(true);
		expect(isMovementKey(PLAYER_MOVEMENT_KEYS.LEFT)).toBe(true);
		expect(isMovementKey(PLAYER_MOVEMENT_KEYS.RIGHT)).toBe(true);
	});

	it("returns true for arrow keys and uppercase movement keys", () => {
		expect(isMovementKey("ArrowUp")).toBe(true);
		expect(isMovementKey("ArrowDown")).toBe(true);
		expect(isMovementKey("ArrowLeft")).toBe(true);
		expect(isMovementKey("ArrowRight")).toBe(true);
		expect(isMovementKey("W")).toBe(true);
		expect(isMovementKey("A")).toBe(true);
		expect(isMovementKey("S")).toBe(true);
		expect(isMovementKey("D")).toBe(true);
	});

	it("returns false for non-movement keys", () => {
		expect(isMovementKey("e")).toBe(false);
		expect(isMovementKey("Space")).toBe(false);
		expect(isMovementKey("")).toBe(false);
	});
});

describe("getMovementKey", () => {
	it("normalizes arrow keys to canonical movement keys", () => {
		expect(getMovementKey("ArrowUp")).toBe(PLAYER_MOVEMENT_KEYS.FORWARD);
		expect(getMovementKey("ArrowDown")).toBe(PLAYER_MOVEMENT_KEYS.BACKWARD);
		expect(getMovementKey("ArrowLeft")).toBe(PLAYER_MOVEMENT_KEYS.LEFT);
		expect(getMovementKey("ArrowRight")).toBe(PLAYER_MOVEMENT_KEYS.RIGHT);
	});

	it("normalizes uppercase WASD keys to canonical movement keys", () => {
		expect(getMovementKey("W")).toBe(PLAYER_MOVEMENT_KEYS.FORWARD);
		expect(getMovementKey("A")).toBe(PLAYER_MOVEMENT_KEYS.LEFT);
		expect(getMovementKey("S")).toBe(PLAYER_MOVEMENT_KEYS.BACKWARD);
		expect(getMovementKey("D")).toBe(PLAYER_MOVEMENT_KEYS.RIGHT);
	});

	it("returns null for non-movement keys", () => {
		expect(getMovementKey("e")).toBeNull();
		expect(getMovementKey("Space")).toBeNull();
	});
});

describe("computeVelocity", () => {
	it("returns forward velocity for w", () => {
		expect(computeVelocity(new Set([PLAYER_MOVEMENT_KEYS.FORWARD]))).toEqual([
			0, 0, -1,
		]);
	});

	it("returns backward velocity for s", () => {
		expect(computeVelocity(new Set([PLAYER_MOVEMENT_KEYS.BACKWARD]))).toEqual([
			0, 0, 1,
		]);
	});

	it("returns left velocity for a", () => {
		expect(computeVelocity(new Set([PLAYER_MOVEMENT_KEYS.LEFT]))).toEqual([
			-1, 0, 0,
		]);
	});

	it("returns right velocity for d", () => {
		expect(computeVelocity(new Set([PLAYER_MOVEMENT_KEYS.RIGHT]))).toEqual([
			1, 0, 0,
		]);
	});

	it("combines velocity for two simultaneously pressed keys", () => {
		expect(
			computeVelocity(
				new Set([PLAYER_MOVEMENT_KEYS.FORWARD, PLAYER_MOVEMENT_KEYS.RIGHT]),
			),
		).toEqual([1, 0, -1]);
	});

	it("returns zero velocity for an empty set", () => {
		expect(computeVelocity(new Set())).toEqual([0, 0, 0]);
	});
});
