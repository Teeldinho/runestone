// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_STATUS } from "@/features/auth";

import { HOME_COPY, HOME_STATUS_COPY } from "../config";

import { HomePage } from "./HomePage";

const mockUseAuthContext = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth", async () => {
	const actual =
		await vi.importActual<typeof import("@/features/auth")>("@/features/auth");

	return {
		...actual,
		UsernameModal: () => null,
		useAuthContext: mockUseAuthContext,
	};
});

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

afterEach(cleanup);

beforeEach(() => {
	mockUseAuthContext.mockReset();
});

describe("HomePage", () => {
	it.each([
		{
			isCheckingSession: true,
			label: "auth checking",
			authStatus: AUTH_STATUS.CHECKING_SESSION,
			statusHeading: HOME_STATUS_COPY.CHECKING_SESSION.title,
		},
		{
			isCheckingSession: false,
			label: "unauthenticated",
			authStatus: AUTH_STATUS.REQUIRES_USERNAME,
			statusHeading: HOME_STATUS_COPY.REQUIRES_USERNAME.title,
		},
		{
			isCheckingSession: false,
			label: "bootstrap failure",
			authStatus: AUTH_STATUS.BOOTSTRAP_FAILED,
			statusHeading: HOME_STATUS_COPY.BOOTSTRAP_FAILED.title,
		},
	])("keeps dungeon entry disabled while $label", ({
		authStatus,
		isCheckingSession,
		statusHeading,
	}) => {
		mockUseAuthContext.mockReturnValue({
			authStatus,
			errorMessage: null,
			handleUsernameFormSubmit: vi.fn(),
			isAuthenticated: false,
			isCheckingSession,
			isUsernameModalOpen: false,
			isUsernameSubmitting: false,
			readyStatusLabel: null,
		});

		render(<HomePage />);

		const dungeonEntryButton = screen.getByRole("button", {
			name: HOME_COPY.CTA_LABEL,
		});

		expect((dungeonEntryButton as HTMLButtonElement).disabled).toBe(true);
		expect(dungeonEntryButton.getAttribute("data-variant")).toBe("default");
		expect(
			screen.getByRole("link", {
				name: HOME_COPY.TUTORIAL_LABEL,
			}),
		).not.toBeNull();
		expect(
			screen
				.getByRole("link", {
					name: HOME_COPY.TUTORIAL_LABEL,
				})
				.getAttribute("data-variant"),
		).toBe("outline");
		expect(screen.getByText(HOME_COPY.SUBTITLE)).not.toBeNull();
		expect(screen.getByText(HOME_COPY.SESSION_NOTE)).not.toBeNull();
		expect(screen.getByText(statusHeading)).not.toBeNull();

		const main = screen.getByRole("main");

		expect(main.className).toContain("h-dvh");
		expect(main.className).toContain("overflow-y-auto");
		expect(main.className).toContain("overscroll-contain");
	});

	it("shows the dungeon entry CTA after authentication", () => {
		mockUseAuthContext.mockReturnValue({
			authStatus: AUTH_STATUS.AUTHENTICATED,
			errorMessage: null,
			handleUsernameFormSubmit: vi.fn(),
			isAuthenticated: true,
			isCheckingSession: false,
			isUsernameModalOpen: false,
			isUsernameSubmitting: false,
			readyStatusLabel: "rune-scribe#42",
		});

		render(<HomePage />);

		expect(
			screen.getByRole("link", {
				name: HOME_COPY.CTA_LABEL,
			}),
		).not.toBeNull();
		expect(
			screen
				.getByRole("link", {
					name: HOME_COPY.CTA_LABEL,
				})
				.getAttribute("data-variant"),
		).toBe("default");
		expect(
			screen
				.getByRole("link", {
					name: HOME_COPY.TUTORIAL_LABEL,
				})
				.getAttribute("data-variant"),
		).toBe("outline");
		expect(screen.getByText(HOME_COPY.BADGE)).not.toBeNull();
		expect(screen.getByText(HOME_COPY.SESSION_NOTE)).not.toBeNull();
		expect(screen.getByText(HOME_COPY.FEATURES_HEADING)).not.toBeNull();
	});
});
