import { describe, expect, it } from "vitest";

import {
	getColumnPlacements,
	getFloorTilePositions,
} from "./roomGltfLayout";

describe("getFloorTilePositions", () => {
	it("returns a 6×6 grid (36 tiles) for a 12×12 room with tileSize 2", () => {
		const positions = getFloorTilePositions(12, 12, 2);

		expect(positions).toHaveLength(36);
	});

	it("all tiles have y=0", () => {
		const positions = getFloorTilePositions(12, 12, 2);

		for (const p of positions) {
			expect(p[1]).toBe(0);
		}
	});

	it("tiles cover both positive and negative x extents", () => {
		const positions = getFloorTilePositions(12, 12, 2);
		const xValues = positions.map((p) => p[0]);

		expect(Math.min(...xValues)).toBeCloseTo(-5);
		expect(Math.max(...xValues)).toBeCloseTo(5);
	});

	it("tiles cover both positive and negative z extents", () => {
		const positions = getFloorTilePositions(12, 12, 2);
		const zValues = positions.map((p) => p[2]);

		expect(Math.min(...zValues)).toBeCloseTo(-5);
		expect(Math.max(...zValues)).toBeCloseTo(5);
	});

	it("returns a 2×2 grid (4 tiles) for a 4×4 room with tileSize 2", () => {
		const positions = getFloorTilePositions(4, 4, 2);

		expect(positions).toHaveLength(4);
	});
});

describe("getColumnPlacements", () => {
	it("returns exactly 4 column positions", () => {
		const columns = getColumnPlacements(12, 12);

		expect(columns).toHaveLength(4);
	});

	it("columns are placed symmetrically at room quadrants", () => {
		const columns = getColumnPlacements(12, 12);
		const xValues = columns.map((c) => c[0]).sort((a, b) => a - b);
		const zValues = columns.map((c) => c[2]).sort((a, b) => a - b);

		expect(xValues[0]).toBeCloseTo(xValues[1]);
		expect(xValues[2]).toBeCloseTo(xValues[3]);
		expect(xValues[0]).toBeLessThan(0);
		expect(xValues[3]).toBeGreaterThan(0);

		expect(zValues[0]).toBeLessThan(0);
		expect(zValues[3]).toBeGreaterThan(0);
	});
});
