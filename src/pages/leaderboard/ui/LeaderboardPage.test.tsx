// @vitest-environment happy-dom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LeaderboardPage } from "./LeaderboardPage";

vi.mock("@/widgets/leaderboard-panel/model", () => ({
	useLeaderboardPanel: () => ({
		entries: [],
		errorMessage: null,
		hasEntries: false,
		isEmpty: true,
		isError: false,
		isLoading: false,
	}),
}));

afterEach(cleanup);

describe("LeaderboardPage", () => {
	it("renders the leaderboard region with the shared panel shell", () => {
		render(<LeaderboardPage />);

		const leaderboardRegion = screen.getByRole("region", {
			name: "Leaderboard",
		});
		const leaderboardContent = within(leaderboardRegion);

		expect(
			leaderboardContent.getByText(
				"No runs submitted yet. Complete a dungeon run to claim the board.",
			),
		).toBeTruthy();
	});
});
