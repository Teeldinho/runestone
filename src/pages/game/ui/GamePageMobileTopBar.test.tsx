// @vitest-environment happy-dom

import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import {
	GAME_PAGE_CONTROLS,
	GAME_PAGE_HOME_ACTION_TEST_IDS,
	GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS,
} from "@/pages/game/config";

import { GamePageMobileTopBar } from "./GamePageMobileTopBar";

vi.mock("@/pages/game/model", () => ({
	useGamePageMobileTopBarModel: () => ({
		cameraStateSnapshot: {
			mode: "free-orbital",
		},
		handleCameraModeSwitch: vi.fn(),
		handleDungeonRunReset: vi.fn(),
		playerHp: 42,
		playerMaxHp: 100,
	}),
}));

vi.mock("@/widgets/camera-mode-switcher", () => ({
	MobileCameraModeSwitcher: () => <div data-testid="mobile-camera-switcher" />,
}));

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

describe("GamePageMobileTopBar", () => {
	it("places the home action to the right of the HP panel", () => {
		render(<GamePageMobileTopBar />);

		const root = screen.getByTestId(GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS.ROOT);
		const leftCluster = screen.getByTestId(
			GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS.LEFT_CLUSTER,
		);
		const rightCluster = screen.getByTestId(
			GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS.RIGHT_CLUSTER,
		);
		const hpPanel = screen.getByTestId(
			GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS.HP_PANEL,
		);
		const homeAction = screen.getByTestId(GAME_PAGE_HOME_ACTION_TEST_IDS.ROOT);

		expect(root.className).toContain("justify-between");
		expect(root.className).toContain("items-start");
		expect(root.className).toContain("safe-area-inset-top");
		expect(root.className).toContain("safe-area-inset-right");
		expect(root.className).toContain("safe-area-inset-left");
		expect(leftCluster.parentElement).toBe(root);
		expect(rightCluster.parentElement).toBe(root);
		expect(hpPanel.parentElement).toBe(rightCluster);
		expect(homeAction.parentElement).toBe(rightCluster);
		expect(rightCluster.firstElementChild).toBe(hpPanel);
		expect(rightCluster.lastElementChild).toBe(homeAction);
		expect(homeAction.getAttribute("href")).toBe("/");
		expect(homeAction.getAttribute("data-size")).toBe("icon");
		expect(homeAction.getAttribute("data-variant")).toBe("dungeon-outline");
		expect(homeAction.className).toContain("size-11");
		expect(hpPanel.className).toContain("min-h-11");
		expect(homeAction.className).not.toContain("w-fit");
		expect(
			screen.getByRole("button", {
				name: "Restart Run",
			}),
		).toBeTruthy();
		expect(
			screen.getByRole("button", {
				name: "Restart Run",
			}).className,
		).toContain("min-h-11");
		expect(
			screen.getByRole("link", {
				name: GAME_PAGE_CONTROLS.NAVIGATION.HOME_ARIA_LABEL,
			}),
		).toBe(homeAction);
		expect(within(root).getByTestId("mobile-camera-switcher")).toBeTruthy();
		expect(screen.getByText("Camera")).toBeTruthy();
		expect(screen.getByText("HP")).toBeTruthy();
	});
});
