// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	DUNGEON_EVENTS,
	FLOOR_IDS,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";

const mockSendDungeonMachineEvent = vi.fn();

const { mockSnapshotGetter, mockPlayerPositionGetter } = vi.hoisted(() => ({
	mockSnapshotGetter: vi.fn(),
	mockPlayerPositionGetter: vi.fn(),
}));

vi.mock("@/features/dungeon-navigation/model/gameMachineRuntime", () => ({
	useGameMachineRuntime: () => ({
		snapshot: mockSnapshotGetter(),
		sendDungeonMachineEvent: mockSendDungeonMachineEvent,
	}),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	getPlayerPosition: () => mockPlayerPositionGetter(),
}));

import { useDoorwayNavigation } from "./useDoorwayNavigation";

const createSnapshot = (
	roomId: RoomId,
	hasTreasureKey = false,
	enemies = 1,
) => ({
	context: {
		currentFloorId: FLOOR_IDS.FLOOR_ONE,
		currentRoomId: roomId,
		discoveredRooms: [ROOM_IDS.ENTRANCE],
		hasTreasureKey,
		enemiesRemaining: enemies,
	},
	value: roomId,
});

describe("useDoorwayNavigation", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
		mockSnapshotGetter.mockReturnValue(createSnapshot(ROOM_IDS.ENTRANCE));
		mockPlayerPositionGetter.mockReturnValue([0, 0, -34]);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("sends a room transition event when player reaches an open doorway", () => {
		renderHook(() => useDoorwayNavigation());

		vi.advanceTimersByTime(200);

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.ENTER_LIBRARY,
		});
	});

	it("sends locked-door attempt and feedback when guard conditions fail", () => {
		mockSnapshotGetter.mockReturnValue(createSnapshot(ROOM_IDS.GUARD_ROOM));
		mockPlayerPositionGetter.mockReturnValue([0, 0, 6]);

		renderHook(() => useDoorwayNavigation());

		vi.advanceTimersByTime(200);

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT,
		});
	});

	it("sends guarded transition when the treasury door is unlocked", () => {
		mockSnapshotGetter.mockReturnValue(
			createSnapshot(ROOM_IDS.GUARD_ROOM, true, 0),
		);
		mockPlayerPositionGetter.mockReturnValue([0, 0, 6]);

		renderHook(() => useDoorwayNavigation());

		vi.advanceTimersByTime(200);

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.ENTER_TREASURY,
		});
	});
});
