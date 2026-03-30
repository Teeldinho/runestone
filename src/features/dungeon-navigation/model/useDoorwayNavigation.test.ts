// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	DUNGEON_EVENTS,
	FLOOR_IDS,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";

const mockSendDungeonMachineEvent = vi.fn();

const { mockSnapshotGetter, mockPlayerPositionGetter, positionListeners } =
	vi.hoisted(() => ({
		mockSnapshotGetter: vi.fn(),
		mockPlayerPositionGetter: vi.fn(),
		positionListeners: new Set<() => void>(),
	}));

vi.mock("@/features/dungeon-navigation/model/gameMachineRuntime", () => ({
	useGameMachineRuntime: () => ({
		snapshot: mockSnapshotGetter(),
		sendDungeonMachineEvent: mockSendDungeonMachineEvent,
	}),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	getPlayerPosition: () => mockPlayerPositionGetter(),
	subscribeToPlayerPosition: (listener: () => void) => {
		positionListeners.add(listener);

		return () => {
			positionListeners.delete(listener);
		};
	},
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
		vi.clearAllMocks();
		positionListeners.clear();
		mockSnapshotGetter.mockReturnValue(createSnapshot(ROOM_IDS.ENTRANCE));
		mockPlayerPositionGetter.mockReturnValue([0, 0, -34]);
	});

	const notifyPlayerPosition = () => {
		for (const listener of positionListeners) {
			listener();
		}
	};

	it("sends a room transition event when player reaches an open doorway", () => {
		renderHook(() => useDoorwayNavigation());

		act(() => {
			notifyPlayerPosition();
		});

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.ENTER_LIBRARY,
		});
	});

	it("sends locked-door attempt and feedback when guard conditions fail", () => {
		mockSnapshotGetter.mockReturnValue(createSnapshot(ROOM_IDS.GUARD_ROOM));
		mockPlayerPositionGetter.mockReturnValue([0, 0, 6]);

		renderHook(() => useDoorwayNavigation());

		act(() => {
			notifyPlayerPosition();
		});

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

		act(() => {
			notifyPlayerPosition();
		});

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.ENTER_TREASURY,
		});
	});

	it("does not immediately trigger the reverse doorway after entering a room", () => {
		vi.useFakeTimers();

		const { rerender } = renderHook(() => useDoorwayNavigation());

		act(() => {
			notifyPlayerPosition();
		});

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.ENTER_LIBRARY,
		});

		mockSendDungeonMachineEvent.mockClear();
		mockSnapshotGetter.mockReturnValue(createSnapshot(ROOM_IDS.LIBRARY));
		mockPlayerPositionGetter.mockReturnValue([0, 0, 6]);

		rerender();

		act(() => {
			notifyPlayerPosition();
		});

		expect(mockSendDungeonMachineEvent).not.toHaveBeenCalled();

		mockPlayerPositionGetter.mockReturnValue([0, 0, 14.8]);

		act(() => {
			notifyPlayerPosition();
		});

		expect(mockSendDungeonMachineEvent).not.toHaveBeenCalled();

		vi.advanceTimersByTime(300);

		mockPlayerPositionGetter.mockReturnValue([0, 0, 20]);

		act(() => {
			notifyPlayerPosition();
		});

		mockPlayerPositionGetter.mockReturnValue([0, 0, 14.8]);

		act(() => {
			notifyPlayerPosition();
		});

		expect(mockSendDungeonMachineEvent).not.toHaveBeenCalled();

		vi.useRealTimers();
	});
});
