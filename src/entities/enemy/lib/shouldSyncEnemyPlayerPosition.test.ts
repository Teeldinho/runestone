import { describe, expect, it } from "vitest";

import { shouldSyncEnemyPlayerPosition } from "./shouldSyncEnemyPlayerPosition";

describe("shouldSyncEnemyPlayerPosition", () => {
	it("returns false before the update interval elapses", () => {
		expect(
			shouldSyncEnemyPlayerPosition({
				elapsedMs: 80,
				lastSentPosition: [0, 0, 0],
				nextPosition: [1, 0, 0],
				positionThreshold: 0.35,
				updateIntervalMs: 120,
			}),
		).toBe(false);
	});

	it("returns false when the player has not moved enough", () => {
		expect(
			shouldSyncEnemyPlayerPosition({
				elapsedMs: 150,
				lastSentPosition: [0, 0, 0],
				nextPosition: [0.1, 0, 0.1],
				positionThreshold: 0.35,
				updateIntervalMs: 120,
			}),
		).toBe(false);
	});

	it("returns true once enough time and movement have elapsed", () => {
		expect(
			shouldSyncEnemyPlayerPosition({
				elapsedMs: 150,
				lastSentPosition: [0, 0, 0],
				nextPosition: [0.5, 0, 0],
				positionThreshold: 0.35,
				updateIntervalMs: 120,
			}),
		).toBe(true);
	});
});
