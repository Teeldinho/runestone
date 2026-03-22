import { describe, expect, it } from "vitest";

import { CORRIDOR_DIRECTIONS, CORRIDOR_ENTITY_CONFIG } from "../config";

import {
	createCorridorMeshSettings,
	getCorridorPosition,
	getCorridorRotationY,
} from "./corridorGeometry";

describe("corridorGeometry", () => {
	it("derives corridor center from anchor and direction", () => {
		const eastPosition = getCorridorPosition({
			anchor: [6, 0, 0],
			depth: CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth,
			direction: CORRIDOR_DIRECTIONS.EAST,
			yOffset: CORRIDOR_ENTITY_CONFIG.SURFACE.Y_OFFSET,
		});

		const northPosition = getCorridorPosition({
			anchor: [0, 0, -6],
			depth: CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth,
			direction: CORRIDOR_DIRECTIONS.NORTH,
			yOffset: CORRIDOR_ENTITY_CONFIG.SURFACE.Y_OFFSET,
		});

		expect(eastPosition).toEqual([10, -0.1, 0]);
		expect(northPosition).toEqual([0, -0.1, -10]);
	});

	it("returns mesh rotation aligned to corridor direction", () => {
		expect(getCorridorRotationY(CORRIDOR_DIRECTIONS.NORTH)).toBe(0);
		expect(getCorridorRotationY(CORRIDOR_DIRECTIONS.SOUTH)).toBe(0);
		expect(getCorridorRotationY(CORRIDOR_DIRECTIONS.EAST)).toBeCloseTo(
			Math.PI / 2,
		);
		expect(getCorridorRotationY(CORRIDOR_DIRECTIONS.WEST)).toBeCloseTo(
			Math.PI / 2,
		);
	});

	it("creates mesh settings for every corridor anchor", () => {
		const corridorSettings = createCorridorMeshSettings({
			anchors: {
				east: [6, 0, 0],
				north: [0, 0, -6],
				south: [0, 0, 6],
				west: [-6, 0, 0],
			},
			depth: CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth,
			yOffset: CORRIDOR_ENTITY_CONFIG.SURFACE.Y_OFFSET,
		});

		expect(corridorSettings).toEqual([
			{
				id: CORRIDOR_DIRECTIONS.NORTH,
				position: [0, -0.1, -10],
				rotationYRad: 0,
			},
			{
				id: CORRIDOR_DIRECTIONS.EAST,
				position: [10, -0.1, 0],
				rotationYRad: Math.PI / 2,
			},
			{
				id: CORRIDOR_DIRECTIONS.SOUTH,
				position: [0, -0.1, 10],
				rotationYRad: 0,
			},
			{
				id: CORRIDOR_DIRECTIONS.WEST,
				position: [-10, -0.1, 0],
				rotationYRad: Math.PI / 2,
			},
		]);
	});
});
