// @vitest-environment happy-dom

import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import {
	GAME_PAGE_CONTROLS,
	GAME_PAGE_DESKTOP_HEADER_TEST_IDS,
	GAME_PAGE_HOME_ACTION_TEST_IDS,
} from "@/pages/game/config";

import { GamePageDesktopHeader } from "./GamePageDesktopHeader";

vi.mock("@/pages/game/model", () => ({
	useGamePageDesktopHeaderModel: () => ({
		currentRoomLabel: "Entrance",
		handleAudioMuteToggle: vi.fn(),
		isAudioMuted: false,
	}),
}));

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

vi.mock("@/shared/ui", async () => {
	const actual =
		await vi.importActual<typeof import("@/shared/ui")>("@/shared/ui");

	return {
		...actual,
		Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
		TooltipContent: ({ children }: { children: ReactNode }) => <>{children}</>,
		TooltipTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
	};
});

vi.mock("@/widgets/leaderboard-panel", () => ({
	LeaderboardSheet: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/widgets/settings-panel", () => ({
	SettingsSheet: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("GamePageDesktopHeader", () => {
	it("places the home action at the far right beside settings", () => {
		render(<GamePageDesktopHeader />);

		const root = screen.getByTestId(GAME_PAGE_DESKTOP_HEADER_TEST_IDS.ROOT);
		const actions = screen.getByTestId(
			GAME_PAGE_DESKTOP_HEADER_TEST_IDS.ACTIONS,
		);
		const homeAction = screen.getByTestId(GAME_PAGE_HOME_ACTION_TEST_IDS.ROOT);

		expect(root.className).toContain("justify-between");
		expect(actions.parentElement).toBe(root);
		expect(homeAction.parentElement).toBe(actions);
		expect(actions.lastElementChild).toBe(homeAction);
		expect(homeAction.getAttribute("href")).toBe("/");
		expect(homeAction.getAttribute("data-size")).toBe("icon-sm");
		expect(homeAction.getAttribute("data-variant")).toBe("dungeon-outline");
		expect(homeAction.className).not.toContain("w-fit");
		expect(
			within(root).getByRole("link", {
				name: "RUNESTONE",
			}),
		).toBeTruthy();
		expect(
			within(actions).getByRole("button", {
				name: GAME_PAGE_CONTROLS.AUDIO.MUTE_ARIA_LABEL,
			}),
		).toBeTruthy();
		expect(
			within(actions).getByRole("button", {
				name: GAME_PAGE_CONTROLS.LEADERBOARD.ARIA_LABEL,
			}),
		).toBeTruthy();
		expect(
			within(actions).getByRole("button", {
				name: GAME_PAGE_CONTROLS.SETTINGS.ARIA_LABEL,
			}),
		).toBeTruthy();
		expect(
			screen.getByRole("link", {
				name: GAME_PAGE_CONTROLS.NAVIGATION.HOME_ARIA_LABEL,
			}),
		).toBe(homeAction);
	});
});
