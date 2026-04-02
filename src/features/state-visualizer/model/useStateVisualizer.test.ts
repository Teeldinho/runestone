// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RoomId } from "@/entities/dungeon";
import { ROOM_IDS } from "@/entities/dungeon";

import { useStateVisualizer } from "./useStateVisualizer";

describe("useStateVisualizer", () => {
	it("returns positioned nodes and graph edges for inspector rendering", () => {
		const { result } = renderHook(() =>
			useStateVisualizer({
				currentRoomId: ROOM_IDS.ENTRANCE,
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

	it("updates active room metadata when the selected room changes", () => {
		const { result, rerender } = renderHook(
			({ currentRoomId }: { currentRoomId: RoomId }) =>
				useStateVisualizer({
					currentRoomId,
				}),
			{
				initialProps: {
					currentRoomId: ROOM_IDS.ENTRANCE,
				} as { currentRoomId: RoomId },
			},
		);

		rerender({
			currentRoomId: ROOM_IDS.GUARD_ROOM,
		});

		const activeNode = result.current.positionedNodes.find(
			(node) => node.isActive,
		);

		expect(activeNode?.id).toBe(ROOM_IDS.GUARD_ROOM);
	});
});
