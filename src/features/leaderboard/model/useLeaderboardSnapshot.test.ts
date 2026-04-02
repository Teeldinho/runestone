// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FLOOR_IDS } from "@/entities/dungeon";
import type { ScoreEntry } from "@/entities/score";

import { useLeaderboardSnapshot } from "./useLeaderboardSnapshot";

const { mockUseQuery, mockLeaderboardQuery } = vi.hoisted(() => ({
	mockUseQuery: vi.fn(),
	mockLeaderboardQuery: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
	useQuery: mockUseQuery,
}));

vi.mock("@/entities/score", () => ({
	scoreQueries: {
		leaderboard: mockLeaderboardQuery,
	},
}));

const SCORE_ENTRIES: ScoreEntry[] = [
	{
		userId: "user-1",
		username: "runestone_hero",
		discriminator: "D0001",
		floorId: FLOOR_IDS.FLOOR_ONE,
		score: 12345,
		timeMs: 125000,
		roomsDiscovered: 4,
		completedAt: 1739980000000,
	},
];

describe("useLeaderboardSnapshot", () => {
	it("returns loading state while the leaderboard query is pending", () => {
		mockLeaderboardQuery.mockReturnValue({
			queryFn: vi.fn(),
			queryKey: ["scores", "leaderboard", FLOOR_IDS.FLOOR_ONE, 10],
		});
		mockUseQuery.mockReturnValue({
			isPending: true,
			isError: false,
			error: null,
			data: undefined,
		});

		const { result } = renderHook(() => useLeaderboardSnapshot());

		expect(mockLeaderboardQuery).toHaveBeenCalledWith(FLOOR_IDS.FLOOR_ONE, 10);
		expect(result.current).toEqual({
			state: "loading",
			entries: [],
			errorMessage: null,
		});
	});

	it("returns error state with query error message", () => {
		mockLeaderboardQuery.mockReturnValue({
			queryFn: vi.fn(),
			queryKey: ["scores", "leaderboard", FLOOR_IDS.FLOOR_ONE, 10],
		});
		mockUseQuery.mockReturnValue({
			isPending: false,
			isError: true,
			error: new Error("Leaderboard unavailable"),
			data: undefined,
		});

		const { result } = renderHook(() => useLeaderboardSnapshot());

		expect(result.current).toEqual({
			state: "error",
			entries: [],
			errorMessage: "Leaderboard unavailable",
		});
	});

	it("returns formatted leaderboard entries when query resolves", () => {
		mockLeaderboardQuery.mockReturnValue({
			queryFn: vi.fn(),
			queryKey: ["scores", "leaderboard", FLOOR_IDS.FLOOR_ONE, 10],
		});
		mockUseQuery.mockReturnValue({
			isPending: false,
			isError: false,
			error: null,
			data: SCORE_ENTRIES,
		});

		const { result } = renderHook(() => useLeaderboardSnapshot());

		expect(result.current).toEqual({
			state: "ready",
			entries: [
				{
					rowId: "user-1:1739980000000",
					rankLabel: "#1",
					playerLabel: "runestone_heroD0001",
					scoreLabel: "12,345",
					runTimeLabel: "2m 05s",
					roomsDiscoveredLabel: "4 rooms",
				},
			],
			errorMessage: null,
		});
	});
});
