import { describe, it, expect } from "vitest";
import { ENEMY_COLLIDER_CONFIG } from "../config";
import {
	computeEnemySpawnHeightOffset,
	computeEnemyGlowOffsetY,
} from "./enemyGeometry";

describe("enemyGeometry", () => {
	describe("computeEnemySpawnHeightOffset", () => {
		it("should return sum of collider half height and radius", () => {
			const expected =
				ENEMY_COLLIDER_CONFIG.HALF_HEIGHT + ENEMY_COLLIDER_CONFIG.RADIUS;
			const result = computeEnemySpawnHeightOffset();
			expect(result).toBeCloseTo(expected);
		});

		it("should equal approximately 0.91", () => {
			const result = computeEnemySpawnHeightOffset();
			expect(result).toBeCloseTo(0.91);
		});
	});

	describe("computeEnemyGlowOffsetY", () => {
		it("should compute negative spawn offset plus tube radius", () => {
			const spawnOffset = computeEnemySpawnHeightOffset();
			const tubeRadius = ENEMY_COLLIDER_CONFIG.RADIUS;
			const expected = -spawnOffset + tubeRadius;
			const result = computeEnemyGlowOffsetY();
			expect(result).toBeCloseTo(expected);
		});
	});
});
