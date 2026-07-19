// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_STATUS } from "@/features/auth";

import { HOME_COPY } from "../config";

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
	handleUsernameEntryRequest: vi.fn(),
	handleUsernameEntryDismiss: vi.fn(),
	handleUsernameFormSubmit: vi.fn(),
	isAuthenticated,
	isCheckingSession: false,
	isUsernameModalOpen: false,
	isUsernameSubmitting: false,
	readyStatusLabel: isAuthenticated ? "Rune_AshBearAAAA" : null,
	suggestedUsername: "Rune_AshBearAAAA",
});

describe("HomePage", () => {
	it("renders the runtime narrative, objective, concepts, and controls", () => {
		mockUseAuthContext.mockReturnValue(createAuthContext(false));

		render(<HomePage />);

		expect(
			screen.getByRole("heading", { name: HOME_COPY.HEADING }),
		).not.toBeNull();
		expect(screen.getByText(HOME_COPY.SUBTITLE)).not.toBeNull();
		expect(
			screen.getByRole("heading", { name: HOME_COPY.PROOF_HEADING }),
		).not.toBeNull();
		expect(
			screen.getByRole("heading", { name: HOME_COPY.RUN_HEADING }),
		).not.toBeNull();
		expect(
			screen.getByRole("heading", { name: HOME_COPY.FIELD_GUIDE_HEADING }),
		).not.toBeNull();
		expect(screen.getByText("Room")).not.toBeNull();
		expect(screen.getByText("State")).not.toBeNull();
		expect(screen.getByText("Interact")).not.toBeNull();
		expect(screen.getByText("Attack")).not.toBeNull();
		expect(screen.getByText("E")).not.toBeNull();
		expect(screen.getByText("F")).not.toBeNull();
		expect(screen.getByText("Left joystick")).not.toBeNull();
		expect(screen.getByText("Drag the viewport")).not.toBeNull();
		expect(screen.getByText("Context buttons")).not.toBeNull();
		expect(screen.getByText("Panels button")).not.toBeNull();
		expect(screen.getByText(HOME_COPY.HERO_META)).not.toBeNull();
		expect(screen.queryByText(/no (account|password|sign-in)/i)).toBeNull();
	});

	it("requests username entry before authentication", () => {
		const authContext = createAuthContext(false);

		mockUseAuthContext.mockReturnValue(authContext);

		render(<HomePage />);

		fireEvent.click(
			screen.getAllByRole("button", {
				name: HOME_COPY.CTA_LABEL,
			})[0] as HTMLButtonElement,
		);

		expect(authContext.handleUsernameEntryRequest).toHaveBeenCalledOnce();
		expect(
			screen.getByRole("link", { name: HOME_COPY.TRACE_LABEL }),
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

	it("shows a retry action when entry bootstrap fails", () => {
		const handleSessionBootstrapRetry = vi.fn();

		mockUseAuthContext.mockReturnValue({
			...createAuthContext(false),
			authStatus: AUTH_STATUS.BOOTSTRAP_FAILED,
			errorMessage: "Convex unreachable",
			handleSessionBootstrapRetry,
		});

		render(<HomePage />);

		screen
			.getAllByRole("button", {
				name: HOME_COPY.RETRY_LABEL,
			})[0]
			.click();

		expect(handleSessionBootstrapRetry).toHaveBeenCalledOnce();
	});
});
