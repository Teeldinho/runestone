import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	clearEnemyPositions,
	getEnemyPositions,
	removeEnemyPosition,
	setEnemyPosition,
	subscribeToEnemyPositions,
} from "./enemyPositionStore";

describe("enemyPositionStore", () => {
	beforeEach(() => {
		clearEnemyPositions();
	});

	it("stores and returns live enemy positions", () => {
		setEnemyPosition("enemy-1", 1, 2, 3);
		setEnemyPosition("enemy-2", 4, 5, 6);

		expect(getEnemyPositions()).toEqual([
			[1, 2, 3],
			[4, 5, 6],
		]);
	});

	it("updates existing enemy positions without duplicating entries", () => {
		setEnemyPosition("enemy-1", 1, 2, 3);
		setEnemyPosition("enemy-1", 7, 8, 9);

		expect(getEnemyPositions()).toEqual([[7, 8, 9]]);
	});

	it("removes enemy positions when an enemy leaves the scene", () => {
		setEnemyPosition("enemy-1", 1, 2, 3);
		removeEnemyPosition("enemy-1");

		expect(getEnemyPositions()).toEqual([]);
	});

	it("notifies subscribers when enemy positions change", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToEnemyPositions(listener);

		setEnemyPosition("enemy-1", 1, 2, 3);
		removeEnemyPosition("enemy-1");

		expect(listener).toHaveBeenCalledTimes(2);

		unsubscribe();
	});
});
