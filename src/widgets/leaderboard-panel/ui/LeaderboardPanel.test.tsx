// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LEADERBOARD_PANEL_COPY } from "../config";
import type { LeaderboardPanelViewModel } from "../model";

import { LeaderboardPanel } from "./LeaderboardPanel";

const { mockUseLeaderboardPanel } = vi.hoisted(() => ({
	mockUseLeaderboardPanel: vi.fn(),
}));

vi.mock("@/widgets/leaderboard-panel/model", () => ({
	useLeaderboardPanel: mockUseLeaderboardPanel,
}));

const LOADING_VIEW_MODEL: LeaderboardPanelViewModel = {
	entries: [],
	errorMessage: null,
	hasEntries: false,
	isEmpty: false,
	isError: false,
	isLoading: true,
};

const ERROR_VIEW_MODEL: LeaderboardPanelViewModel = {
	entries: [],
	errorMessage: "Leaderboard unavailable",
	hasEntries: false,
	isEmpty: false,
	isError: true,
	isLoading: false,
};

const EMPTY_VIEW_MODEL: LeaderboardPanelViewModel = {
	entries: [],
	errorMessage: null,
	hasEntries: false,
	isEmpty: true,
	isError: false,
	isLoading: false,
};

const POPULATED_VIEW_MODEL: LeaderboardPanelViewModel = {
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
	hasEntries: true,
	isEmpty: false,
	isError: false,
	isLoading: false,
};

afterEach(() => {
	cleanup();
	mockUseLeaderboardPanel.mockReset();
});

describe("LeaderboardPanel", () => {
	it("renders the loading state", () => {
		mockUseLeaderboardPanel.mockReturnValue(LOADING_VIEW_MODEL);

		render(<LeaderboardPanel />);

		expect(screen.getByText(LEADERBOARD_PANEL_COPY.TITLE)).toBeTruthy();
		expect(screen.getByRole("status")).toBeTruthy();
		expect(screen.getByText(LEADERBOARD_PANEL_COPY.STATE.LOADING)).toBeTruthy();
		expect(screen.queryByRole("table")).toBeNull();
	});

	it("renders the error state", () => {
		mockUseLeaderboardPanel.mockReturnValue(ERROR_VIEW_MODEL);

		render(<LeaderboardPanel />);

		expect(screen.getByRole("alert")).toBeTruthy();
		expect(screen.getByText(ERROR_VIEW_MODEL.errorMessage ?? "")).toBeTruthy();
		expect(screen.queryByRole("table")).toBeNull();
	});

	it("renders the empty state", () => {
		mockUseLeaderboardPanel.mockReturnValue(EMPTY_VIEW_MODEL);

		render(<LeaderboardPanel />);

		expect(screen.getByText(LEADERBOARD_PANEL_COPY.STATE.EMPTY)).toBeTruthy();
		expect(screen.queryByRole("table")).toBeNull();
	});

	it("renders the populated table with accessible semantics", () => {
		mockUseLeaderboardPanel.mockReturnValue(POPULATED_VIEW_MODEL);

		render(<LeaderboardPanel />);

		expect(screen.getByText(LEADERBOARD_PANEL_COPY.TITLE)).toBeTruthy();
		expect(screen.getByText(LEADERBOARD_PANEL_COPY.DESCRIPTION)).toBeTruthy();
		expect(
			screen.getByRole("table", {
				name: LEADERBOARD_PANEL_COPY.TABLE.CAPTION,
			}),
		).toBeTruthy();
		expect(screen.getByText("#1")).toBeTruthy();
		expect(screen.getByText("runestone_heroD0001")).toBeTruthy();
		expect(screen.getByText("12,345")).toBeTruthy();
	});
});
