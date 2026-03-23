// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RoomId } from "@/entities/dungeon";
import { FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";

const mockOnRoomEnter = vi.fn();
const mockOnTransition = vi.fn();
const mockOnFloorComplete = vi.fn();
const mockHandleSoundEffectPlay = vi.fn();
const mockMutate = vi.fn();

const { mockSnapshotGetter, mockProfileGetter } = vi.hoisted(() => ({
	mockSnapshotGetter: vi.fn(),
	mockProfileGetter: vi.fn(),
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachineRuntime: () => ({
		snapshot: mockSnapshotGetter(),
		sendDungeonMachineEvent: vi.fn(),
	}),
}));

vi.mock("@/features/haptics-feedback", () => ({
	useHaptics: () => ({
		onRoomEnter: mockOnRoomEnter,
		onTransition: mockOnTransition,
		onFloorComplete: mockOnFloorComplete,
		onGuardFail: vi.fn(),
	}),
}));

vi.mock("@/features/audio-manager", () => ({
	useAudioController: () => ({
		handleSoundEffectPlay: mockHandleSoundEffectPlay,
	}),
}));

vi.mock("@/entities/score", () => ({
	useSubmitDungeonScore: () => ({ mutate: mockMutate }),
}));

vi.mock("@/features/auth", () => ({
	useAuthContext: () => ({ authenticatedProfile: mockProfileGetter() }),
}));

const createMockSnapshot = (
	roomId: RoomId = ROOM_IDS.ENTRANCE,
	status: "active" | "done" = "active",
	discoveredRooms: RoomId[] = [ROOM_IDS.ENTRANCE],
) => ({
	value: roomId,
	context: {
		currentRoomId: roomId,
		currentFloorId: FLOOR_IDS.FLOOR_ONE,
		discoveredRooms,
		hasTreasureKey: false,
		enemiesRemaining: 1,
	},
	status,
});

const MOCK_PROFILE = {
	id: "user-convex-id",
	username: "hero",
	discriminator: "0001",
};

import { useGameSideEffects } from "./useGameSideEffects";

describe("useGameSideEffects — haptics and audio", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSnapshotGetter.mockReturnValue(createMockSnapshot());
		mockProfileGetter.mockReturnValue(MOCK_PROFILE);
	});

	it("calls onTransition on initial render", () => {
		renderHook(() => useGameSideEffects());

		expect(mockOnTransition).toHaveBeenCalledTimes(1);
	});

	it("calls onRoomEnter and plays DOOR_OPEN on the first render (prev room is null)", () => {
		renderHook(() => useGameSideEffects());

		expect(mockOnRoomEnter).toHaveBeenCalledTimes(1);
		expect(mockHandleSoundEffectPlay).toHaveBeenCalledWith("DOOR_OPEN");
	});

	it("calls onRoomEnter again when room changes", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(ROOM_IDS.LIBRARY, "active", [
					ROOM_IDS.ENTRANCE,
					ROOM_IDS.LIBRARY,
				]),
			);
		});
		rerender();

		expect(mockOnRoomEnter).toHaveBeenCalledTimes(1);
		expect(mockHandleSoundEffectPlay).toHaveBeenCalledWith("DOOR_OPEN");
	});

	it("does NOT call onRoomEnter when room is unchanged between renders", () => {
		const snapshot = createMockSnapshot(ROOM_IDS.LIBRARY);
		mockSnapshotGetter.mockReturnValue(snapshot);
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		rerender();

		expect(mockOnRoomEnter).not.toHaveBeenCalled();
	});

	it("calls onTransition on every snapshot change", () => {
		const { rerender } = renderHook(() => useGameSideEffects());

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(ROOM_IDS.LIBRARY, "active", [
					ROOM_IDS.ENTRANCE,
					ROOM_IDS.LIBRARY,
				]),
			);
		});
		rerender();

		expect(mockOnTransition).toHaveBeenCalledTimes(2);
	});
});

describe("useGameSideEffects — score submission on floor completion", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSnapshotGetter.mockReturnValue(createMockSnapshot());
		mockProfileGetter.mockReturnValue(MOCK_PROFILE);
	});

	it("calls onFloorComplete and plays ACHIEVEMENT when status becomes done", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(
					ROOM_IDS.EXIT,
					"done",
					Object.values(ROOM_IDS) as RoomId[],
				),
			);
		});
		rerender();

		expect(mockOnFloorComplete).toHaveBeenCalledTimes(1);
		expect(mockHandleSoundEffectPlay).toHaveBeenCalledWith("ACHIEVEMENT");
	});

	it("submits score with correct shape when floor is complete and user is authenticated", () => {
		const allRooms = Object.values(ROOM_IDS) as RoomId[];
		const { rerender } = renderHook(() => useGameSideEffects());

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(ROOM_IDS.EXIT, "done", allRooms),
			);
		});
		rerender();

		expect(mockMutate).toHaveBeenCalledOnce();
		const args = mockMutate.mock.calls[0][0] as Record<string, unknown>;
		expect(args.userId).toBe(MOCK_PROFILE.id);
		expect(args.dungeonId).toBe(FLOOR_IDS.FLOOR_ONE);
		expect(typeof args.score).toBe("number");
		expect(typeof args.timeMs).toBe("number");
		expect(args.roomsDiscovered).toBe(allRooms.length);
	});

	it("does NOT submit score when user is not authenticated", () => {
		mockProfileGetter.mockReturnValue(null);
		const { rerender } = renderHook(() => useGameSideEffects());

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(ROOM_IDS.EXIT, "done"),
			);
		});
		rerender();

		expect(mockMutate).not.toHaveBeenCalled();
	});

	it("submits score only once even when re-rendered in done state", () => {
		const doneSnapshot = createMockSnapshot(
			ROOM_IDS.EXIT,
			"done",
			Object.values(ROOM_IDS) as RoomId[],
		);
		mockSnapshotGetter.mockReturnValue(doneSnapshot);
		const { rerender } = renderHook(() => useGameSideEffects());

		rerender();
		rerender();

		expect(mockMutate).toHaveBeenCalledOnce();
	});
});
