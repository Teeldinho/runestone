// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	DUNGEON_EVENTS,
	FLOOR_IDS,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";

const { mockSnapshotGetter, mockPlayerPositionGetter, positionListeners } =
	vi.hoisted(() => ({
		mockSnapshotGetter: vi.fn(),
		mockPlayerPositionGetter: vi.fn(),
		positionListeners: new Set<() => void>(),
	}));

vi.mock("@/features/dungeon-navigation/model/gameMachineRuntime", () => ({
	useGameMachineRuntime: () => ({
		snapshot: mockSnapshotGetter(),
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

import { getDoorwayDetection } from "../lib/doorwayDetectionStore";
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

	it("sets doorway detection when player reaches an open doorway", () => {
		renderHook(() => useDoorwayNavigation());

		act(() => {
			notifyPlayerPosition();
		});

		const detection = getDoorwayDetection();
		expect(detection).not.toBeNull();
		expect(detection?.eventType).toBe(DUNGEON_EVENTS.ENTER_LIBRARY);
		expect(detection?.isLocked).toBe(false);
	});

	it("sets locked-door detection when guard conditions fail", () => {
		mockSnapshotGetter.mockReturnValue(createSnapshot(ROOM_IDS.GUARD_ROOM));
		mockPlayerPositionGetter.mockReturnValue([0, 0, 6]);

		renderHook(() => useDoorwayNavigation());

		act(() => {
			notifyPlayerPosition();
		});

		const detection = getDoorwayDetection();
		expect(detection).not.toBeNull();
		expect(detection?.eventType).toBe(DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT);
		expect(detection?.isLocked).toBe(true);
	});

	it("sets guarded transition detection when the treasury door is unlocked", () => {
		mockSnapshotGetter.mockReturnValue(
			createSnapshot(ROOM_IDS.GUARD_ROOM, true, 0),
		);
		mockPlayerPositionGetter.mockReturnValue([0, 0, 6]);

		renderHook(() => useDoorwayNavigation());

		act(() => {
			notifyPlayerPosition();
		});

		const detection = getDoorwayDetection();
		expect(detection).not.toBeNull();
		expect(detection?.eventType).toBe(DUNGEON_EVENTS.ENTER_TREASURY);
		expect(detection?.isLocked).toBe(false);
	});

	it("clears detection when player is inside room bounds", () => {
		const { rerender } = renderHook(() => useDoorwayNavigation());

		act(() => {
			notifyPlayerPosition();
		});

		expect(getDoorwayDetection()).not.toBeNull();

		mockSnapshotGetter.mockReturnValue(createSnapshot(ROOM_IDS.LIBRARY));
		mockPlayerPositionGetter.mockReturnValue([0, 0, 0]);

		rerender();

		act(() => {
			notifyPlayerPosition();
		});

		expect(getDoorwayDetection()).toBeNull();
	});
});
