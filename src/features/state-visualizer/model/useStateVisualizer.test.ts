// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DungeonContext } from "@/entities/dungeon";
import { FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";

import { useStateVisualizer } from "./useStateVisualizer";

const createDungeonContext = (
	overrides?: Partial<DungeonContext>,
): DungeonContext => ({
	currentFloorId: FLOOR_IDS.FLOOR_ONE,
	currentRoomId: ROOM_IDS.ENTRANCE,
	discoveredRooms: [ROOM_IDS.ENTRANCE],
	hasTreasureKey: false,
	enemiesRemaining: 1,
	openedDoors: [],
	nearInteractable: null,
	nearInteractableType: null,
	lastTransition: null,
	...overrides,
});

describe("useStateVisualizer", () => {
	it("returns positioned nodes and graph edges for inspector rendering", () => {
		const { result } = renderHook(() =>
			useStateVisualizer({
				context: createDungeonContext(),
			}),
		);

		expect(result.current.positionedNodes).toHaveLength(5);
		expect(result.current.edges).toHaveLength(8);

		const entranceNode = result.current.positionedNodes.find(
			(node) => node.id === ROOM_IDS.ENTRANCE,
		);

		expect(entranceNode?.isActive).toBe(true);
		expect(entranceNode?.position.x).toEqual(expect.any(Number));
		expect(entranceNode?.position.y).toEqual(expect.any(Number));
	});

	it("updates active room metadata when dungeon context changes", () => {
		const { result, rerender } = renderHook(
			({ context }: { context: DungeonContext }) =>
				useStateVisualizer({
					context,
				}),
			{
				initialProps: {
					context: createDungeonContext(),
				},
			},
		);

		rerender({
			context: createDungeonContext({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				discoveredRooms: [
					ROOM_IDS.ENTRANCE,
					ROOM_IDS.LIBRARY,
					ROOM_IDS.GUARD_ROOM,
				],
			}),
		});

		const activeNode = result.current.positionedNodes.find(
			(node) => node.isActive,
		);

		expect(activeNode?.id).toBe(ROOM_IDS.GUARD_ROOM);
	});
});
