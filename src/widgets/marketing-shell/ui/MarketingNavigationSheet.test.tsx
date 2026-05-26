// @vitest-environment happy-dom

import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
	MARKETING_FOOTER_LINKS,
	MARKETING_NAVIGATION_ITEM_IDS,
	MARKETING_NAVIGATION_ITEMS,
	MARKETING_SHELL_COPY,
} from "../config";
import { createMarketingNavigationViewModel } from "../lib";
import { MarketingNavigationSheet } from "./MarketingNavigationSheet";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

afterEach(() => {
	cleanup();
});

const renderSheet = (isAuthenticated: boolean, onEntryRequest = vi.fn()) => {
	const viewModel = createMarketingNavigationViewModel({
		activeNavigationItemId: MARKETING_NAVIGATION_ITEM_IDS.GUIDE,
		footerLinks: MARKETING_FOOTER_LINKS,
		navigationItems: MARKETING_NAVIGATION_ITEMS,
	});

	render(
		<MarketingNavigationSheet
			isAuthenticated={isAuthenticated}
			onEntryRequest={onEntryRequest}
			viewModel={viewModel}
		/>,
	);
};

describe("MarketingNavigationSheet", () => {
	it("opens a left-side sheet with the shared navigation links", () => {
		renderSheet(true);

		expect(screen.queryByRole("dialog")).toBeNull();

		fireEvent.click(
			screen.getByRole("button", {
				name: MARKETING_SHELL_COPY.OPEN_NAVIGATION_LABEL,
			}),
		);

		const dialog = screen.getByRole("dialog", {
			name: MARKETING_SHELL_COPY.NAVIGATION_SHEET_TITLE,
		});

		expect(dialog.getAttribute("data-side")).toBe("left");

		const dialogQueries = within(dialog);

		expect(
			dialogQueries.getByText(
				MARKETING_SHELL_COPY.NAVIGATION_SHEET_DESCRIPTION,
			),
		).toBeTruthy();
		expect(dialogQueries.getByRole("link", { name: "Guide" })).toBeTruthy();
		expect(dialogQueries.getByRole("link", { name: "Concepts" })).toBeTruthy();
		expect(dialogQueries.getByRole("link", { name: "GitHub" })).toBeTruthy();
		expect(dialogQueries.queryByText("Repo")).toBeNull();
		expect(
			dialogQueries.getByRole("link", {
				name: MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL,
			}),
		).toBeTruthy();
	});

	it("requests username entry when unauthenticated", () => {
		const handleEntryRequest = vi.fn();

		renderSheet(false, handleEntryRequest);

		fireEvent.click(
			screen.getByRole("button", {
				name: MARKETING_SHELL_COPY.OPEN_NAVIGATION_LABEL,
			}),
		);

		const dialog = screen.getByRole("dialog", {
			name: MARKETING_SHELL_COPY.NAVIGATION_SHEET_TITLE,
		});
		const dialogQueries = within(dialog);
		const entryButton = dialogQueries.getByRole("button", {
			name: MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL,
		});

		fireEvent.click(entryButton);

		expect(handleEntryRequest).toHaveBeenCalledOnce();
	});
});
