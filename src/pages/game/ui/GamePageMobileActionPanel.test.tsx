// @vitest-environment happy-dom

import { render, screen, within } from "@testing-library/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
	GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES,
	GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS,
	GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES,
	GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_TEST_IDS,
} from "@/pages/game/config";
import type { GamePageMobileActionPanelModel } from "@/pages/game/model";

import { GamePageMobileActionPanel } from "./GamePageMobileActionPanel";

const handleTouchAttack = vi.fn();
const handleTouchInteract = vi.fn();
const handleAudioMuteToggle = vi.fn();

let mockIsTabletLayout = true;

const mockTouchActions: GamePageMobileActionPanelModel["touchActions"] = {
	attack: {
		handleTouchAttack,
		hasTouchAttack: true,
		touchAttackPrompt: "Attack",
	},
	interact: {
		handleTouchInteract,
		hasTouchInteract: true,
		touchInteractPrompt: "Open Door",
	},
};

const resetTouchActionState = () => {
	mockTouchActions.attack.hasTouchAttack = true;
	mockTouchActions.attack.touchAttackPrompt = "Attack";
	mockTouchActions.interact.hasTouchInteract = true;
	mockTouchActions.interact.touchInteractPrompt = "Open Door";
	mockIsTabletLayout = true;
};

vi.mock("@/pages/game/model", () => ({
	useGamePageMobileActionPanelModel: () => ({
		audioToggle: {
			handleAudioMuteToggle,
			isAudioMuted: false,
			isTabletLayout: mockIsTabletLayout,
		},
		leaderboardTrigger: {
			isTabletLayout: mockIsTabletLayout,
		},
		settingsTrigger: {
			isTabletLayout: mockIsTabletLayout,
		},
		sheetTrigger: {
			handleMobileSheetOpen: vi.fn(),
			isMobileSheetOpen: true,
			isTabletLayout: mockIsTabletLayout,
		},
		touchActions: mockTouchActions,
	}),
}));

vi.mock("@/shared/ui", () => ({
	Badge: ({ className }: { className?: string }) => (
		<span data-testid="badge" className={className} />
	),
	Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
		<button type="button" {...props}>
			{children}
		</button>
	),
	DrawerTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
	Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
	TooltipContent: ({ children }: { children: ReactNode }) => <>{children}</>,
	TooltipTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/widgets/leaderboard-panel", () => ({
	LeaderboardSheet: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/widgets/settings-panel", () => ({
	SettingsSheet: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

afterEach(() => {
	handleTouchAttack.mockClear();
	handleTouchInteract.mockClear();
	handleAudioMuteToggle.mockClear();
	resetTouchActionState();
});

describe("GamePageMobileActionPanel", () => {
	it("renders the tablet action stack inside a fixed prompt shell", () => {
		mockIsTabletLayout = true;

		const { container } = render(<GamePageMobileActionPanel />);
		const view = within(container);
		const panelRoot = view.getByTestId(
			GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.ROOT,
		);
		const promptSlot = view.getByTestId(
			GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.PROMPT_SLOT,
		);
		const controlStack = view.getByTestId(
			GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.CONTROL_STACK,
		);
		const touchActionPanel = view.getByTestId(
			GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_TEST_IDS.ROOT,
		);

		expect(panelRoot.className).toContain("pointer-events-auto");
		expect(panelRoot.className).toContain("relative");
		expect(panelRoot.className).toContain(
			GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.TABLET_WIDTH,
		);
		expect(panelRoot.className).not.toContain("absolute");
		expect(promptSlot.className).toBe(
			GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.PROMPT_SLOT,
		);
		expect(controlStack.className).toBe(
			GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.CONTROL_STACK,
		);
		expect(touchActionPanel.parentElement).toBe(promptSlot);
		expect(touchActionPanel.className).toBe(
			GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES.ROOT,
		);
		expect(view.getByRole("button", { name: "Attack" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Door" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Mute audio" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Leaderboard" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Panels" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Settings" })).toBeTruthy();
		expect(screen.getByText("Audio")).toBeTruthy();
		expect(screen.getByText("Rankings")).toBeTruthy();
		expect(screen.getByText("Panels")).toBeTruthy();
		expect(screen.getByText("Settings")).toBeTruthy();
		expect(panelRoot.getAttribute("data-input-blocks-look")).toBe("true");
	});

	it("renders the compact action stack without labels on smaller phones", () => {
		mockIsTabletLayout = false;

		const { container } = render(<GamePageMobileActionPanel />);
		const view = within(container);
		const panelRoot = view.getByTestId(
			GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.ROOT,
		);
		const promptSlot = view.getByTestId(
			GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.PROMPT_SLOT,
		);
		const touchActionPanel = view.getByTestId(
			GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_TEST_IDS.ROOT,
		);

		expect(panelRoot.className).toContain(
			GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.COMPACT_WIDTH,
		);
		expect(panelRoot.className).not.toContain(
			GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.TABLET_WIDTH,
		);
		expect(promptSlot.className).toBe(
			GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.PROMPT_SLOT,
		);
		expect(touchActionPanel.parentElement).toBe(promptSlot);
		expect(view.getByRole("button", { name: "Attack" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Door" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Mute audio" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Leaderboard" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Panels" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Settings" })).toBeTruthy();
		expect(view.queryByText("Audio")).toBeNull();
		expect(view.queryByText("Rankings")).toBeNull();
		expect(view.queryByText("Panels")).toBeNull();
		expect(view.queryByText("Settings")).toBeNull();
	});

	it("keeps the prompt slot from changing the panel width when prompts toggle", () => {
		const { container, rerender } = render(<GamePageMobileActionPanel />);
		const view = within(container);
		const panelRoot = view.getByTestId(
			GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.ROOT,
		);
		const promptSlot = view.getByTestId(
			GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.PROMPT_SLOT,
		);
		const controlStack = view.getByTestId(
			GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.CONTROL_STACK,
		);
		const touchActionPanel = view.getByTestId(
			GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_TEST_IDS.ROOT,
		);

		const initialPanelClassName = panelRoot.className;
		const initialPromptSlotClassName = promptSlot.className;
		const initialControlStackClassName = controlStack.className;
		const initialTouchActionPanelClassName = touchActionPanel.className;

		expect(view.getByRole("button", { name: "Attack" })).toBeTruthy();
		expect(view.getByRole("button", { name: "Open Door" })).toBeTruthy();

		mockTouchActions.attack.hasTouchAttack = false;
		mockTouchActions.attack.touchAttackPrompt = null;
		mockTouchActions.interact.hasTouchInteract = false;
		mockTouchActions.interact.touchInteractPrompt = null;

		rerender(<GamePageMobileActionPanel />);

		expect(view.queryByRole("button", { name: "Attack" })).toBeNull();
		expect(view.queryByRole("button", { name: "Open Door" })).toBeNull();
		expect(
			view.getByTestId(GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.ROOT).className,
		).toBe(initialPanelClassName);
		expect(
			view.getByTestId(GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.PROMPT_SLOT)
				.className,
		).toBe(initialPromptSlotClassName);
		expect(
			view.getByTestId(GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.CONTROL_STACK)
				.className,
		).toBe(initialControlStackClassName);
		expect(
			view.getByTestId(GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_TEST_IDS.ROOT)
				.className,
		).toBe(initialTouchActionPanelClassName);
	});

	it("wires the touch action handlers from the model", () => {
		const { container } = render(<GamePageMobileActionPanel />);
		const view = within(container);

		view.getByRole("button", { name: "Attack" }).click();
		view.getByRole("button", { name: "Open Door" }).click();
		view.getByRole("button", { name: "Mute audio" }).click();

		expect(handleTouchAttack).toHaveBeenCalledTimes(1);
		expect(handleTouchInteract).toHaveBeenCalledTimes(1);
		expect(handleAudioMuteToggle).toHaveBeenCalledTimes(1);
	});
});
