// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MARKETING_NAVIGATION_ITEM_IDS, MARKETING_SHELL_COPY } from "../config";
import { MarketingShell } from "./MarketingShell";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

afterEach(cleanup);

describe("MarketingShell", () => {
	it("renders the shared navigation shell once for marketing routes", () => {
		render(
			<MarketingShell
				activeNavigationItemId={MARKETING_NAVIGATION_ITEM_IDS.GUIDE}
				isAuthenticated
				onEntryRequest={vi.fn()}
			>
				<div>Shell content</div>
			</MarketingShell>,
		);

		expect(
			screen.getAllByRole("link", {
				name: MARKETING_SHELL_COPY.BRAND_NAME,
			}).length,
		).toBeGreaterThan(0);
		expect(
			screen.getAllByRole("link", {
				name: "Guide",
			}).length,
		).toBeGreaterThan(0);
		expect(
			screen.getAllByRole("link", {
				name: "Concepts",
			}).length,
		).toBeGreaterThan(0);
		expect(
			screen.getByRole("link", {
				name: "GitHub",
			}),
		).not.toBeNull();
		expect(
			screen.getByRole("button", {
				name: MARKETING_SHELL_COPY.OPEN_NAVIGATION_LABEL,
			}),
		).not.toBeNull();
		expect(screen.getByText("Shell content")).not.toBeNull();
	});
});
