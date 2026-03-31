import { describe, expect, it } from "vitest";

import {
	ENEMY_ENTITY_CONFIG,
	ENEMY_SPAWN_HEIGHT_OFFSET,
} from "./enemyEntityConfig";

describe("enemy entity config", () => {
	it("keeps the collider and spawn height aligned", () => {
		expect(ENEMY_SPAWN_HEIGHT_OFFSET).toBeCloseTo(
			ENEMY_ENTITY_CONFIG.COLLIDER.HALF_HEIGHT +
				ENEMY_ENTITY_CONFIG.COLLIDER.RADIUS,
			3,
		);
	});

	it("keeps the glow ring grounded near the floor", () => {
		expect(ENEMY_ENTITY_CONFIG.GLOW.OFFSET_Y).toBeCloseTo(
			-ENEMY_SPAWN_HEIGHT_OFFSET + ENEMY_ENTITY_CONFIG.GLOW.TUBE_RADIUS,
			3,
		);
	});
});
