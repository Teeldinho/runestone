// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LeaderboardPage } from "./LeaderboardPage";

vi.mock("@/widgets/leaderboard-panel", () => ({
	LeaderboardPanel: () => <div data-testid="leaderboard-panel-widget" />,
}));

describe("LeaderboardPage", () => {
	it("renders leaderboard widget composition", () => {
		render(<LeaderboardPage />);

		expect(screen.getByTestId("leaderboard-panel-widget")).not.toBeNull();
	});
});
