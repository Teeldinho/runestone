// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { DungeonContext } from "@/entities/dungeon";
import { FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useStateVisualizer } from "@/features/state-visualizer";
import { GAME_PAGE_COPY } from "@/pages/game/config";

import { useGamePage } from "./useGamePage";

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachine: vi.fn(),
}));

vi.mock("@/features/state-visualizer", () => ({
	useStateVisualizer: vi.fn(),
}));

describe("useGamePage", () => {
	it("composes page data from machine and visualizer hooks", () => {
		const machineContext: DungeonContext = {
			currentFloorId: FLOOR_IDS.FLOOR_ONE,
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			hasTreasureKey: false,
			enemiesRemaining: 1,
		};

		vi.mocked(useGameMachine).mockReturnValue({
			actionButtons: [],
			currentRoomLabel: "Entrance",
			discoveredRoomLabels: ["Entrance"],
			handleDungeonRunReset: vi.fn(),
			handleDungeonEventSend: vi.fn(),
			snapshot: {
				context: machineContext,
				value: ROOM_IDS.ENTRANCE,
			},
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(useStateVisualizer).mockReturnValue({
			edges: [],
			nodes: [],
			positionedNodes: [],
		} as unknown as ReturnType<typeof useStateVisualizer>);

		const { result } = renderHook(() => useGamePage());

		expect(useStateVisualizer).toHaveBeenCalledWith({
			context: machineContext,
		});
		expect(result.current.canvasMachineRuntime).toEqual({
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 1,
			hasTreasureKey: false,
		});
		expect(result.current.hasTreasureKeyLabel).toBe(
			GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		);
		expect(result.current.activeStateLabel).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.currentRoomLabel).toBe("Entrance");
	});
});
