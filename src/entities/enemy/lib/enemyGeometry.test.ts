import { describe, expect, it } from "vitest";
import { ENEMY_COLLIDER_CONFIG, ENEMY_GLOW_CONFIG } from "../config";
import {
	computeEnemyGlowOffsetY,
	computeEnemySpawnHeightOffset,
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
			const tubeRadius = ENEMY_GLOW_CONFIG.TUBE_RADIUS;
			const expected = -spawnOffset + tubeRadius;
			const result = computeEnemyGlowOffsetY();
			expect(result).toBeCloseTo(expected);
		});

		it("should equal approximately -0.87", () => {
			const result = computeEnemyGlowOffsetY();
			expect(result).toBeCloseTo(-0.87, 2);
		});
	});
});
