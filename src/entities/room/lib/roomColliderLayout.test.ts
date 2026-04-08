import { describe, expect, it } from "vitest";

import { ROOM_ENTITY_CONFIG } from "../config";

import {
	getRoomColumnColliderSettings,
	getTreasuryChestCollider,
	getTreasuryChestPosition,
} from "./roomColliderLayout";

describe("roomColliderLayout", () => {
	it("returns four column colliders aligned with column placements", () => {
		const colliders = getRoomColumnColliderSettings(12, 12);

		expect(colliders).toHaveLength(4);

		for (const collider of colliders) {
			expect(collider.args).toEqual([
				ROOM_ENTITY_CONFIG.COLLIDERS.COLUMN.HALF_WIDTH,
				ROOM_ENTITY_CONFIG.COLLIDERS.COLUMN.HALF_HEIGHT,
				ROOM_ENTITY_CONFIG.COLLIDERS.COLUMN.HALF_DEPTH,
			]);
			expect(collider.position[1]).toBe(
				ROOM_ENTITY_CONFIG.COLLIDERS.COLUMN.POSITION_Y,
			);
		}

		const xValues = colliders.map((collider) => collider.position[0]).sort();
		const zValues = colliders.map((collider) => collider.position[2]).sort();

		expect(xValues[0]).toBeCloseTo(-3.6);
		expect(xValues[3]).toBeCloseTo(3.6);
		expect(zValues[0]).toBeCloseTo(-3.6);
		expect(zValues[3]).toBeCloseTo(3.6);
	});

	it("derives treasury chest visual position from room depth", () => {
		expect(getTreasuryChestPosition(12)).toEqual([0, 0, -3]);
	});

	it("returns a treasury chest collider aligned with the chest position", () => {
		expect(getTreasuryChestCollider(12)).toEqual({
			args: [
				ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.HALF_WIDTH,
				ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.HALF_HEIGHT,
				ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.HALF_DEPTH,
			],
			position: [0, ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.POSITION_Y, -3],
		});
	});
});
