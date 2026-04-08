import { describe, expect, it } from "vitest";

import { CORRIDOR_CONFIG } from "@/shared/config";

import { CORRIDOR_ENTITY_CONFIG, CORRIDOR_HALF_WIDTH } from "../config";

import { getCorridorSideWallColliders } from "./corridorColliderLayout";

describe("getCorridorSideWallColliders", () => {
	it("returns left and right wall colliders with mirrored x positions", () => {
		const colliders = getCorridorSideWallColliders({
			depth: CORRIDOR_CONFIG.DEPTH,
			halfWidth: CORRIDOR_HALF_WIDTH,
			wallColliderThickness:
				CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_COLLIDER_THICKNESS,
			wallHeight: CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT,
		});

		expect(colliders).toEqual([
			{
				side: "left",
				args: [
					CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_COLLIDER_THICKNESS / 2,
					CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT / 2,
					CORRIDOR_CONFIG.DEPTH / 2,
				],
				position: [
					-CORRIDOR_HALF_WIDTH,
					CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT / 2,
					0,
				],
			},
			{
				side: "right",
				args: [
					CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_COLLIDER_THICKNESS / 2,
					CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT / 2,
					CORRIDOR_CONFIG.DEPTH / 2,
				],
				position: [
					CORRIDOR_HALF_WIDTH,
					CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT / 2,
					0,
				],
			},
		]);
	});
});
