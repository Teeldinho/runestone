// @vitest-environment happy-dom

import { render, screen, within } from "@testing-library/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { GamePageMobileActionPanel } from "./GamePageMobileActionPanel";

const handleTouchAttack = vi.fn();
const handleTouchInteract = vi.fn();
const handleAudioMuteToggle = vi.fn();

vi.mock("@/pages/game/model", () => ({
	useGamePageMobileActionPanelModel: () => ({
		audioToggle: {
			handleAudioMuteToggle,
			isAudioMuted: false,
			isTabletLayout: true,
		},
		leaderboardTrigger: {
			isTabletLayout: true,
		},
		settingsTrigger: {
			isTabletLayout: true,
		},
		sheetTrigger: {
			handleMobileSheetOpen: vi.fn(),
			isMobileSheetOpen: true,
			isTabletLayout: true,
		},
		touchActions: {
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
		},
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

describe("GamePageMobileActionPanel", () => {
	it("renders grouped mobile action controls", () => {
		const { container } = render(<GamePageMobileActionPanel />);
		const panelRoot = container.firstElementChild as HTMLElement;

		expect(screen.getByRole("button", { name: "Attack" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Open Door" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Mute audio" })).toBeTruthy();
		expect(
			screen.getByRole("button", { name: "Open Leaderboard" }),
		).toBeTruthy();
		expect(screen.getByRole("button", { name: "Open Panels" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Open Settings" })).toBeTruthy();
		expect(screen.getByText("Audio")).toBeTruthy();
		expect(screen.getByText("Rankings")).toBeTruthy();
		expect(screen.getByText("Panels")).toBeTruthy();
		expect(screen.getByText("Settings")).toBeTruthy();
		expect(panelRoot.classList.contains("pointer-events-auto")).toBe(true);
		expect(panelRoot.classList.contains("absolute")).toBe(false);
		expect(panelRoot.className).toContain("w-fit");
		expect(panelRoot.getAttribute("data-input-blocks-look")).toBe("true");

		expect(
			screen
				.getAllByRole("button")
				.map(
					(button) =>
						button.getAttribute("aria-label") ??
						button.textContent?.trim() ??
						"",
				),
		).toEqual([
			"Open Door",
			"Attack",
			"Mute audio",
			"Open Leaderboard",
			"Open Panels",
			"Open Settings",
		]);

		const settingsIconClass =
			screen
				.getByRole("button", { name: "Open Settings" })
				.querySelector("svg")
				?.getAttribute("class") ?? "";

		expect(settingsIconClass).not.toContain("text-[var(--dungeon-gold)]");
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
