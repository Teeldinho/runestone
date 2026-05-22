// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";

const mockUseGamePageMobileSheetContentModel = vi.fn();

vi.mock("@/pages/game/model", () => ({
	useGamePageMobileSheetContentModel: () =>
		mockUseGamePageMobileSheetContentModel(),
}));

vi.mock("./GamePageMobileHudTab", () => ({
	GamePageMobileHudTab: () => <div data-testid="mobile-hud-tab" />,
}));

vi.mock("./GamePageMobileStatechartTab", () => ({
	GamePageMobileStatechartTab: () => (
		<div data-testid="mobile-statechart-tab" />
	),
}));

import { Drawer } from "@/shared/ui";
import { GamePageMobileSheetContent } from "./GamePageMobileSheetContent";

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe("GamePageMobileSheetContent", () => {
	it("uses an inline header on phones", () => {
		mockUseGamePageMobileSheetContentModel.mockReturnValue({
			cameraStateSnapshot: {
				distance: 6,
				fov: 58,
				mode: "freeOrbital",
				pitch: 0,
				position: [0, 8, 10] as [number, number, number],
				target: [0, 0, 0] as [number, number, number],
				yaw: 0,
				zoom: 1,
			},
			drawerContentHeightClassName: "h-[90dvh]",
			graphSections: [],
			handleCameraModeSwitch: vi.fn(),
			handleMobileSheetTabChange: vi.fn(),
			isTabletLayout: false,
			mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		});

		render(
			<Drawer open>
				<GamePageMobileSheetContent />
			</Drawer>,
		);

		const header = screen
			.getByText(GAME_PAGE_MOBILE_SHEET.TITLE)
			.closest('[data-slot="drawer-header"]') as HTMLElement;
		const drawerContent = screen
			.getByText(GAME_PAGE_MOBILE_SHEET.TITLE)
			.closest('[data-slot="drawer-content"]') as HTMLElement;

		expect(drawerContent.className).toContain(
			`h-[${GAME_PAGE_MOBILE_SHEET.HEIGHT_DVH}dvh]`,
		);
		expect(header.className).toContain("flex");
		expect(header.className).toContain("justify-between");
		expect(header.className).not.toContain("grid");
		expect(screen.getByTestId("mobile-statechart-tab")).toBeTruthy();
		expect(screen.getByTestId("mobile-hud-tab")).toBeTruthy();
	});

	it("keeps the stacked drawer header on tablets", () => {
		mockUseGamePageMobileSheetContentModel.mockReturnValue({
			cameraStateSnapshot: {
				distance: 6,
				fov: 58,
				mode: "freeOrbital",
				pitch: 0,
				position: [0, 8, 10] as [number, number, number],
				target: [0, 0, 0] as [number, number, number],
				yaw: 0,
				zoom: 1,
			},
			drawerContentHeightClassName: "h-[90dvh]",
			graphSections: [],
			handleCameraModeSwitch: vi.fn(),
			handleMobileSheetTabChange: vi.fn(),
			isTabletLayout: true,
			mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		});

		render(
			<Drawer open>
				<GamePageMobileSheetContent />
			</Drawer>,
		);

		const header = screen
			.getByText(GAME_PAGE_MOBILE_SHEET.TITLE)
			.closest('[data-slot="drawer-header"]') as HTMLElement;

		expect(header.className).toContain("grid");
		expect(header.className).not.toContain("flex");
	});
});
