// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RoomId } from "@/entities/dungeon";
import { FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";
import {
	ACHIEVEMENT_COPY,
	ACHIEVEMENT_DISPLAY_DURATION_MS,
	ACHIEVEMENT_IDS,
} from "@/features/achievements";

const mockOnAchievement = vi.fn();

const { mockSnapshotGetter } = vi.hoisted(() => ({
	mockSnapshotGetter: vi.fn(),
}));

vi.mock("@/features/dungeon-navigation", () => ({
	selectAchievementTrackingContext: vi.fn(),
	useGameMachineSelector: () => mockSnapshotGetter().context,
}));

vi.mock("@/features/haptics-feedback", () => ({
	useHaptics: () => ({ onAchievement: mockOnAchievement }),
}));

vi.mock("@/features/achievements", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/features/achievements")>();

	return {
		...actual,
		hasReachedLibrary: vi.fn(),
		hasCollectedKey: vi.fn(),
		hasDefeatedAllEnemies: vi.fn(),
		hasEscapedFloor: vi.fn(),
	};
});

import {
	hasCollectedKey,
	hasDefeatedAllEnemies,
	hasEscapedFloor,
	hasReachedLibrary,
} from "@/features/achievements";

const makeSnapshot = (
	discoveredRooms: RoomId[] = [ROOM_IDS.ENTRANCE],
	hasTreasureKey = false,
	enemiesRemaining = 3,
) => ({
	value: ROOM_IDS.ENTRANCE,
	context: {
		currentFloorId: FLOOR_IDS.FLOOR_ONE,
		currentRoomId: ROOM_IDS.ENTRANCE,
		discoveredRooms,
		hasTreasureKey,
		enemiesRemaining,
	},
});

import { useAchievementTracker } from "./useAchievementTracker";

describe("useAchievementTracker", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		vi.mocked(hasReachedLibrary).mockReturnValue(false);
		vi.mocked(hasCollectedKey).mockReturnValue(false);
		vi.mocked(hasDefeatedAllEnemies).mockReturnValue(false);
		vi.mocked(hasEscapedFloor).mockReturnValue(false);
		mockSnapshotGetter.mockReturnValue(makeSnapshot());
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns null activeAchievement when no conditions are met", () => {
		const { result } = renderHook(() => useAchievementTracker());
		expect(result.current.activeAchievement).toBeNull();
	});

	it("fires onAchievement when FIRST_STEPS triggers", () => {
		vi.mocked(hasReachedLibrary).mockReturnValue(true);
		renderHook(() => useAchievementTracker());

		expect(mockOnAchievement).toHaveBeenCalledTimes(1);
	});

	it("sets activeAchievement to FIRST_STEPS when library is reached", () => {
		vi.mocked(hasReachedLibrary).mockReturnValue(true);
		const { result } = renderHook(() => useAchievementTracker());

		expect(result.current.activeAchievement).toEqual({
			id: ACHIEVEMENT_IDS.FIRST_STEPS,
			label: ACHIEVEMENT_COPY.FIRST_STEPS.label,
			description: ACHIEVEMENT_COPY.FIRST_STEPS.description,
		});
	});

	it("does not fire the same achievement twice (dedup)", () => {
		vi.mocked(hasReachedLibrary).mockReturnValue(true);
		const { rerender } = renderHook(() => useAchievementTracker());

		rerender();
		rerender();

		expect(mockOnAchievement).toHaveBeenCalledTimes(1);
	});

	it("clears activeAchievement after ACHIEVEMENT_DISPLAY_DURATION_MS", () => {
		vi.mocked(hasReachedLibrary).mockReturnValue(true);
		const { result } = renderHook(() => useAchievementTracker());

		expect(result.current.activeAchievement).not.toBeNull();

		act(() => {
			vi.advanceTimersByTime(ACHIEVEMENT_DISPLAY_DURATION_MS);
		});

		expect(result.current.activeAchievement).toBeNull();
	});

	it("resets triggered achievements when dungeon resets", () => {
		vi.mocked(hasReachedLibrary).mockReturnValue(true);
		mockSnapshotGetter.mockReturnValue(
			makeSnapshot([ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY]),
		);
		const { rerender } = renderHook(() => useAchievementTracker());

		expect(mockOnAchievement).toHaveBeenCalledTimes(1);

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				makeSnapshot([ROOM_IDS.ENTRANCE], false),
			);
		});
		rerender();

		vi.mocked(hasReachedLibrary).mockReturnValue(true);
		act(() => {
			mockSnapshotGetter.mockReturnValue(
				makeSnapshot([ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY]),
			);
		});
		rerender();

		expect(mockOnAchievement).toHaveBeenCalledTimes(2);
	});
});
