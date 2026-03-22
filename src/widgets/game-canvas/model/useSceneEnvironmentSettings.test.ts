// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
	CORRIDOR_DIRECTION_ORDER,
	CORRIDOR_DIRECTIONS,
} from "@/entities/corridor";
import { ROOM_ENTITY_CONFIG } from "@/entities/room";

import { useSceneEnvironmentSettings } from "./useSceneEnvironmentSettings";

describe("useSceneEnvironmentSettings", () => {
	it("returns room label settings from room config constants", () => {
		const { result } = renderHook(() => useSceneEnvironmentSettings());

		expect(result.current.roomLabelSettings).toEqual({
			isVisible: true,
			position: [0, 7, 0],
			text: ROOM_ENTITY_CONFIG.LABEL.TEXT,
		});
		expect(result.current.roomPosition).toEqual(ROOM_ENTITY_CONFIG.ORIGIN);
	});

	it("returns four corridor meshes aligned to room edges", () => {
		const { result } = renderHook(() => useSceneEnvironmentSettings());

		expect(result.current.corridorMeshSettings).toEqual([
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
		expect(result.current.corridorMeshSettings).toHaveLength(
			CORRIDOR_DIRECTION_ORDER.length,
		);
	});
});
