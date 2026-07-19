// @vitest-environment happy-dom

import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/ui";
import { LEADERBOARD_PANEL_COPY } from "@/widgets/leaderboard-panel/config";

import { LeaderboardSheet } from "./LeaderboardSheet";

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

afterEach(() => {
	cleanup();
});

describe("LeaderboardSheet", () => {
	it("opens the leaderboard panel from the trigger and keeps it accessible", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<LeaderboardSheet>
						<TooltipTrigger asChild>
							<Button type="button">Open Leaderboard</Button>
						</TooltipTrigger>
					</LeaderboardSheet>
					<TooltipContent>{LEADERBOARD_PANEL_COPY.TITLE}</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(screen.queryByRole("dialog")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Open Leaderboard" }));

		const dialog = screen.getByRole("dialog", {
			name: LEADERBOARD_PANEL_COPY.TITLE,
		});
		const closeAction = within(dialog).getByRole("button", { name: "Close" });

		expect(dialog).toBeTruthy();
		expect(dialog.className).toContain("safe-area-inset-top");
		expect(dialog.className).toContain("safe-area-inset-bottom");
		expect(closeAction.className).toContain("size-11");
		expect(screen.getByText(LEADERBOARD_PANEL_COPY.STATE.EMPTY)).toBeTruthy();

		fireEvent.click(closeAction);

		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
