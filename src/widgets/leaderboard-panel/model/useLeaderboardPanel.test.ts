// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LeaderboardSnapshot } from "@/features/leaderboard";

import { useLeaderboardPanel } from "./useLeaderboardPanel";

const { mockUseLeaderboardSnapshot } = vi.hoisted(() => ({
	mockUseLeaderboardSnapshot: vi.fn(),
}));

vi.mock("@/features/leaderboard", () => ({
	useLeaderboardSnapshot: mockUseLeaderboardSnapshot,
}));

const LOADING_SNAPSHOT: LeaderboardSnapshot = {
	state: "loading",
	entries: [],
	errorMessage: null,
};

const ERROR_SNAPSHOT: LeaderboardSnapshot = {
	state: "error",
	entries: [],
	errorMessage: "Leaderboard unavailable",
};

const EMPTY_SNAPSHOT: LeaderboardSnapshot = {
	state: "ready",
	entries: [],
	errorMessage: null,
};

const POPULATED_SNAPSHOT: LeaderboardSnapshot = {
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
