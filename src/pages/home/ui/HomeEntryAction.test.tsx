// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_STATUS } from "@/features/auth";

import { HomeEntryAction } from "./HomeEntryAction";

const { hydrationState } = vi.hoisted(() => ({
	hydrationState: { isHydrated: false },
}));

vi.mock("@tanstack/react-router", () => ({
	ClientOnly: ({
		children,
		fallback,
	}: {
		children: ReactNode;
		fallback: ReactNode;
	}) => (hydrationState.isHydrated ? children : fallback),
	Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

const createProps = (
	overrides: Partial<ComponentProps<typeof HomeEntryAction>> = {},
): ComponentProps<typeof HomeEntryAction> => ({
	authStatus: AUTH_STATUS.CHECKING_SESSION,
	errorMessage: null,
	isAuthenticated: false,
	label: "Enter Floor I",
	onEntryRequest: vi.fn(),
	onRetry: vi.fn(),
	readyStatusLabel: null,
	...overrides,
});

afterEach(cleanup);

beforeEach(() => {
	hydrationState.isHydrated = false;
});

describe("HomeEntryAction", () => {
	it("keeps a fixed loading skeleton through hydration and session checking", () => {
		const { container, rerender } = render(
			<HomeEntryAction {...createProps()} />,
		);
		const fallbackButton = screen.getByRole("button", {
			name: "Enter Floor I",
		});
		const fallbackRoot = fallbackButton.parentElement;

		expect(fallbackButton.getAttribute("disabled")).not.toBeNull();
		expect(fallbackRoot?.getAttribute("aria-busy")).toBe("true");
		expect(fallbackRoot?.className).toContain("min-h-17");
		expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();

		hydrationState.isHydrated = true;
		rerender(<HomeEntryAction {...createProps()} />);

		expect(
			screen
				.getByRole("button", { name: "Enter Floor I" })
				.getAttribute("disabled"),
		).not.toBeNull();
		expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
	});

	it("keeps the same action height after an authenticated session resolves", () => {
		hydrationState.isHydrated = true;
		const { rerender } = render(<HomeEntryAction {...createProps()} />);
		const loadingRoot = screen.getByRole("button", {
			name: "Enter Floor I",
		}).parentElement;
		const loadingClassName = loadingRoot?.className;

		rerender(
			<HomeEntryAction
				{...createProps({
					authStatus: AUTH_STATUS.AUTHENTICATED,
					isAuthenticated: true,
					readyStatusLabel: "Rune_AshBearAAAA",
				})}
			/>,
		);

		const entryLink = screen.getByRole("link", { name: "Enter Floor I" });
		expect(entryLink.parentElement?.className).toBe(loadingClassName);
		expect(entryLink.parentElement?.className).toContain("min-h-17");
		expect(screen.getByText("Playing as Rune_AshBearAAAA")).not.toBeNull();
	});

	it("reserves the status line when the session requires a username", () => {
		hydrationState.isHydrated = true;
		render(
			<HomeEntryAction
				{...createProps({ authStatus: AUTH_STATUS.REQUIRES_USERNAME })}
			/>,
		);

		const entryButton = screen.getByRole("button", {
			name: "Enter Floor I",
		});
		expect(entryButton.getAttribute("disabled")).toBeNull();
		expect(entryButton.parentElement?.className).toContain("min-h-17");
	});
});
