// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AUTH_STATUS } from "../config";

const mockUseMachine = vi.hoisted(() => vi.fn());
const mockUseAuthSessionBootstrap = vi.hoisted(() => vi.fn());
const mockUseAuthUsernameSubmission = vi.hoisted(() => vi.fn());
const mockCreateSuggestedUsername = vi.hoisted(() => vi.fn());
const mockCreateAuthContextValue = vi.hoisted(() => vi.fn());

vi.mock("@xstate/react", () => ({
	useMachine: mockUseMachine,
}));

vi.mock("./authMachine", () => ({
	authMachine: {},
}));

vi.mock("./useAuthSessionBootstrap", () => ({
	useAuthSessionBootstrap: mockUseAuthSessionBootstrap,
}));

vi.mock("./useAuthUsernameSubmission", () => ({
	useAuthUsernameSubmission: mockUseAuthUsernameSubmission,
}));

vi.mock("../lib", async () => {
	const actual = await vi.importActual<typeof import("../lib")>("../lib");

	return {
		...actual,
		createAuthContextValue: mockCreateAuthContextValue,
		createSuggestedUsername: mockCreateSuggestedUsername,
	};
});

import { useAuth } from "./useAuth";

describe("useAuth", () => {
	it("generates and reuses a suggested username for the auth context", () => {
		const handleSessionBootstrapRetry = vi.fn();
		const handleUsernameFormSubmit = vi.fn();
		const sendAuthEvent = vi.fn();
		const snapshot = {
			value: AUTH_STATUS.REQUIRES_USERNAME,
			context: {
				profile: null,
				errorMessage: null,
			},
			matches: (status: string) => status === AUTH_STATUS.REQUIRES_USERNAME,
		};

		mockUseMachine.mockReturnValue([snapshot, sendAuthEvent]);
		mockUseAuthSessionBootstrap.mockReturnValue({
			handleSessionBootstrapRetry,
			sessionUuid: "session-uuid",
		});
		mockUseAuthUsernameSubmission.mockReturnValue({
			handleUsernameFormSubmit,
		});
		mockCreateSuggestedUsername.mockReturnValue("Rune_AshBearAAAA");
		mockCreateAuthContextValue.mockImplementation(
			({ suggestedUsername: returnedSuggestedUsername, ...input }) => ({
				...input,
				authStatus: AUTH_STATUS.REQUIRES_USERNAME,
				authenticatedProfile: null,
				errorMessage: null,
				isCheckingSession: false,
				isAuthenticated: false,
				isUsernameModalOpen: true,
				isUsernameSubmitting: false,
				readyStatusLabel: null,
				suggestedUsername: returnedSuggestedUsername,
			}),
		);

		const { result, rerender } = renderHook(() => useAuth());

		expect(result.current.suggestedUsername).toBe("Rune_AshBearAAAA");
		expect(mockCreateSuggestedUsername).toHaveBeenCalledTimes(1);
		expect(mockCreateAuthContextValue).toHaveBeenCalledWith(
			expect.objectContaining({
				snapshot,
				suggestedUsername: "Rune_AshBearAAAA",
				handleSessionBootstrapRetry,
				handleUsernameFormSubmit,
			}),
		);

		rerender();

		expect(mockCreateSuggestedUsername).toHaveBeenCalledTimes(1);
	});
});
