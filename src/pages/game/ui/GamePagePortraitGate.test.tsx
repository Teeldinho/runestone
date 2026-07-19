// @vitest-environment happy-dom

import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { GAME_PAGE_PORTRAIT_GATE } from "@/pages/game/config";

import { GamePagePortraitGate } from "./GamePagePortraitGate";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

describe("GamePagePortraitGate", () => {
	it("renders nothing when landscape play is available", () => {
		render(<GamePagePortraitGate isVisible={false} />);

		expect(screen.queryByRole("alertdialog")).toBeNull();
	});

	it("blocks portrait play with an announced dialog and exit action", () => {
		render(<GamePagePortraitGate isVisible />);

		const dialog = screen.getByRole("alertdialog", {
			name: GAME_PAGE_PORTRAIT_GATE.TITLE,
		});
		const homeAction = within(dialog).getByRole("link", {
			name: GAME_PAGE_PORTRAIT_GATE.HOME_ACTION_LABEL,
		});

		expect(
			within(dialog).getByText(GAME_PAGE_PORTRAIT_GATE.DESCRIPTION),
		).toBeTruthy();
		expect(within(dialog).getByText(GAME_PAGE_PORTRAIT_GATE.BODY)).toBeTruthy();
		expect(homeAction.getAttribute("href")).toBe("/");
		expect(homeAction.className).toContain("min-h-11");
		expect(within(dialog).queryByRole("button", { name: "Close" })).toBeNull();
		expect(dialog.className.split(" ")).toContain("max-w-[calc(100%-2rem)]");
		expect(dialog.className.split(" ")).not.toContain("max-w-sm");
	});
});
