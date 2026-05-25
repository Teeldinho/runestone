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

const createAuthContext = (isAuthenticated: boolean) => ({
	authStatus: isAuthenticated
		? AUTH_STATUS.AUTHENTICATED
		: AUTH_STATUS.REQUIRES_USERNAME,
	errorMessage: null,
	handleSessionBootstrapRetry: vi.fn(),
	handleUsernameFormSubmit: vi.fn(),
	isAuthenticated,
	isCheckingSession: false,
	isUsernameModalOpen: false,
	isUsernameSubmitting: false,
	readyStatusLabel: isAuthenticated ? "Rune_AshBearAAAA" : null,
	suggestedUsername: "Rune_AshBearAAAA",
});

describe("HomePage", () => {
	it("renders the redesigned landing copy and concept sections", () => {
		mockUseAuthContext.mockReturnValue(createAuthContext(false));

		render(<HomePage />);

		expect(
			screen.getByRole("heading", { name: HOME_COPY.HEADING }),
		).not.toBeNull();
		expect(screen.getByText(HOME_COPY.SUBTITLE)).not.toBeNull();
		expect(screen.getByText(HOME_COPY.MANIFEST_PATH_SUBTITLE)).not.toBeNull();
		expect(screen.getByText(HOME_COPY.RUNTIME_HEADING)).not.toBeNull();
		expect(screen.getByText(HOME_COPY.FEATURES_HEADING)).not.toBeNull();
		expect(screen.getByText("State → Room")).not.toBeNull();
		expect(screen.getByText("States become rooms")).not.toBeNull();
		expect(screen.getByText("Viewport")).not.toBeNull();
	});

	it("keeps dungeon entry disabled before authentication", () => {
		mockUseAuthContext.mockReturnValue(createAuthContext(false));

		render(<HomePage />);

		expect(
			screen
				.getAllByRole("button", {
					name: HOME_COPY.CTA_LABEL,
				})
				.every((button) => (button as HTMLButtonElement).disabled),
		).toBe(true);
		expect(
			screen.getByRole("link", {
				name: HOME_COPY.TUTORIAL_LABEL,
			}),
		).not.toBeNull();
	});

	it("shows dungeon entry links after authentication", () => {
		mockUseAuthContext.mockReturnValue(createAuthContext(true));

		render(<HomePage />);

		expect(
			screen.getAllByRole("link", {
				name: HOME_COPY.CTA_LABEL,
			}).length,
		).toBeGreaterThan(0);
	});

	it("shows a retry action when bootstrap fails", () => {
		const handleSessionBootstrapRetry = vi.fn();

		mockUseAuthContext.mockReturnValue({
			...createAuthContext(false),
			authStatus: AUTH_STATUS.BOOTSTRAP_FAILED,
			errorMessage: "Convex unreachable",
			handleSessionBootstrapRetry,
		});

		render(<HomePage />);

		screen
			.getByRole("button", {
				name: HOME_STATUS_COPY.BOOTSTRAP_FAILED.actionLabel,
			})
			.click();

		expect(handleSessionBootstrapRetry).toHaveBeenCalledOnce();
	});
});
