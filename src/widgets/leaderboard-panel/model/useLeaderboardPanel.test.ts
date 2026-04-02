// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LeaderboardSnapshot } from "@/features/leaderboard";

import { useLeaderboardPanel } from "./useLeaderboardPanel";

const { mockUseLeaderboardSnapshot, LEADERBOARD_STATES } = vi.hoisted(() => ({
	mockUseLeaderboardSnapshot: vi.fn(),
	LEADERBOARD_STATES: {
		IDLE: "idle" as const,
		LOADING: "loading" as const,
		READY: "ready" as const,
		ERROR: "error" as const,
	},
}));

vi.mock("@/features/leaderboard", () => ({
	useLeaderboardSnapshot: mockUseLeaderboardSnapshot,
	LEADERBOARD_STATES,
}));

const LOADING_SNAPSHOT: LeaderboardSnapshot = {
	state: LEADERBOARD_STATES.LOADING,
	entries: [],
	errorMessage: null,
};

const ERROR_SNAPSHOT: LeaderboardSnapshot = {
	state: LEADERBOARD_STATES.ERROR,
	entries: [],
	errorMessage: "Leaderboard unavailable",
};

const EMPTY_SNAPSHOT: LeaderboardSnapshot = {
	state: LEADERBOARD_STATES.READY,
	entries: [],
	errorMessage: null,
};

const POPULATED_SNAPSHOT: LeaderboardSnapshot = {
	state: LEADERBOARD_STATES.READY,
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
};

describe("useLeaderboardPanel", () => {
	it("reports isLoading when snapshot state is loading", () => {
		mockUseLeaderboardSnapshot.mockReturnValue(LOADING_SNAPSHOT);

		const { result } = renderHook(() => useLeaderboardPanel());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.isEmpty).toBe(false);
		expect(result.current.hasEntries).toBe(false);
		expect(result.current.entries).toEqual([]);
		expect(result.current.errorMessage).toBeNull();
	});

	it("reports isError and surfaces errorMessage when snapshot state is error", () => {
		mockUseLeaderboardSnapshot.mockReturnValue(ERROR_SNAPSHOT);

		const { result } = renderHook(() => useLeaderboardPanel());

		expect(result.current.isError).toBe(true);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isEmpty).toBe(false);
		expect(result.current.hasEntries).toBe(false);
		expect(result.current.errorMessage).toBe("Leaderboard unavailable");
		expect(result.current.entries).toEqual([]);
	});

	it("reports isEmpty when snapshot is ready with no entries", () => {
		mockUseLeaderboardSnapshot.mockReturnValue(EMPTY_SNAPSHOT);

		const { result } = renderHook(() => useLeaderboardPanel());

		expect(result.current.isEmpty).toBe(true);
		expect(result.current.hasEntries).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.entries).toEqual([]);
	});

	it("reports hasEntries and passes through entries when snapshot is ready with data", () => {
		mockUseLeaderboardSnapshot.mockReturnValue(POPULATED_SNAPSHOT);

		const { result } = renderHook(() => useLeaderboardPanel());

		expect(result.current.hasEntries).toBe(true);
		expect(result.current.isEmpty).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.entries).toEqual(POPULATED_SNAPSHOT.entries);
		expect(result.current.errorMessage).toBeNull();
	});
});
