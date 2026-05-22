// @vitest-environment happy-dom

import { cleanup, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_STATUS } from "@/features/auth";

import { TUTORIAL_CONTROLS, TUTORIAL_COPY } from "../config";

import { TutorialPage } from "./TutorialPage";

const mockUseAuthContext = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth", async () => {
	const actual =
		await vi.importActual<typeof import("@/features/auth")>("@/features/auth");

	return {
		...actual,
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

describe("TutorialPage", () => {
	it.each([
		{
			authStatus: AUTH_STATUS.CHECKING_SESSION,
			isCheckingSession: true,
			label: "auth checking",
		},
		{
			authStatus: AUTH_STATUS.BOOTSTRAP_FAILED,
			isCheckingSession: false,
			label: "bootstrap failure",
		},
	])("keeps the dungeon entry CTA disabled while $label", ({
		authStatus,
		isCheckingSession,
	}) => {
		mockUseAuthContext.mockReturnValue({
			authenticatedProfile: null,
			authStatus,
			errorMessage: null,
			handleUsernameFormSubmit: vi.fn(),
			isAuthenticated: false,
			isCheckingSession,
			isUsernameModalOpen: false,
			isUsernameSubmitting: false,
			readyStatusLabel: null,
			suggestedUsername: "Rune_AshBearAAAA",
		});

		render(<TutorialPage />);

		const dungeonEntryButton = screen.getByRole("button", {
			name: TUTORIAL_COPY.CTA_LABEL,
		});

		expect((dungeonEntryButton as HTMLButtonElement).disabled).toBe(true);
		expect(dungeonEntryButton.getAttribute("data-variant")).toBe("default");
		expect(
			screen.getByRole("link", {
				name: TUTORIAL_COPY.HOME_LABEL,
			}),
		).not.toBeNull();
		expect(
			screen
				.getByRole("link", {
					name: TUTORIAL_COPY.HOME_LABEL,
				})
				.getAttribute("data-variant"),
		).toBe("outline");
		expect(screen.getByText(TUTORIAL_CONTROLS[0].detail)).not.toBeNull();
		expect(screen.getByText(TUTORIAL_CONTROLS[1].detail)).not.toBeNull();
		expect(screen.getByText(TUTORIAL_CONTROLS[2].detail)).not.toBeNull();
		expect(screen.getByText(TUTORIAL_CONTROLS[3].detail)).not.toBeNull();

		const main = screen.getByRole("main");

		expect(main.className).toContain("h-dvh");
		expect(main.className).toContain("overflow-y-auto");
		expect(main.className).toContain("overscroll-contain");
	});

	it("keeps the dungeon entry CTA in the hero when authenticated", () => {
		mockUseAuthContext.mockReturnValue({
			authenticatedProfile: {
				discriminator: "0420",
				username: "rune-scribe",
			},
			authStatus: AUTH_STATUS.AUTHENTICATED,
			errorMessage: null,
			handleUsernameFormSubmit: vi.fn(),
			isAuthenticated: true,
			isCheckingSession: false,
			isUsernameModalOpen: false,
			isUsernameSubmitting: false,
			readyStatusLabel: "rune-scribe#0420",
			suggestedUsername: "Rune_AshBearAAAA",
		});

		render(<TutorialPage />);

		const hero = screen
			.getByRole("heading", { name: TUTORIAL_COPY.HEADING })
			.closest("header");

		expect(hero).not.toBeNull();
		expect(
			within(hero as HTMLElement).getByRole("link", {
				name: TUTORIAL_COPY.CTA_LABEL,
			}),
		).not.toBeNull();
		expect(
			within(hero as HTMLElement)
				.getByRole("link", {
					name: TUTORIAL_COPY.CTA_LABEL,
				})
				.getAttribute("data-variant"),
		).toBe("default");
		expect(
			within(hero as HTMLElement)
				.getByRole("link", {
					name: TUTORIAL_COPY.HOME_LABEL,
				})
				.getAttribute("data-variant"),
		).toBe("outline");
		expect(screen.getByText(TUTORIAL_COPY.SUBTITLE)).not.toBeNull();
	});
});
