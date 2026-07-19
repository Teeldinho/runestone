import { describe, expect, it, vi } from "vitest";

import type { UserProfile } from "@/entities/user";

import { AUTH_STATUS } from "../config";

import { createAuthContextValue } from "./createAuthContextValue";

const TEST_USER_PROFILE: UserProfile = {
	id: "user-1",
	uuid: "uuid-1",
	username: "runestone_hero",
	discriminator: "0001",
	createdAt: 1,
	updatedAt: 1,
};

const createAuthSnapshot = ({
	value,
	profile,
	errorMessage,
	matchedStates,
}: {
	value: string;
	profile: UserProfile | null;
	errorMessage: string | null;
	matchedStates: string[];
}) => ({
	value,
	context: {
		profile,
		errorMessage,
		isUsernameEntryRequested: false,
		isUsernameEntryDeferred: false,
	},
	matches: (status: string) => matchedStates.includes(status),
});

describe("createAuthContextValue", () => {
	it("builds authenticated context state with ready label", () => {
		const handleUsernameFormSubmit = vi.fn();
		const handleSessionBootstrapRetry = vi.fn();
		const handleUsernameEntryRequest = vi.fn();
		const handleUsernameEntryDismiss = vi.fn();
		const snapshot = createAuthSnapshot({
			value: AUTH_STATUS.AUTHENTICATED,
			profile: TEST_USER_PROFILE,
			errorMessage: null,
			matchedStates: [AUTH_STATUS.AUTHENTICATED],
		});

		const authContextValue = createAuthContextValue({
			snapshot,
			suggestedUsername: "Rune_AshBearAAAA",
			handleUsernameFormSubmit,
			handleSessionBootstrapRetry,
			handleUsernameEntryRequest,
			handleUsernameEntryDismiss,
		});

		expect(authContextValue.authStatus).toBe(AUTH_STATUS.AUTHENTICATED);
		expect(authContextValue.authenticatedProfile).toBe(TEST_USER_PROFILE);
		expect(authContextValue.isAuthenticated).toBe(true);
		expect(authContextValue.isCheckingSession).toBe(false);
		expect(authContextValue.isUsernameSubmitting).toBe(false);
		expect(authContextValue.isUsernameModalOpen).toBe(false);
		expect(authContextValue.readyStatusLabel).toBe("runestone_hero0001");
		expect(authContextValue.suggestedUsername).toBe("Rune_AshBearAAAA");
		expect(authContextValue.handleUsernameFormSubmit).toBe(
			handleUsernameFormSubmit,
		);
		expect(authContextValue.handleSessionBootstrapRetry).toBe(
			handleSessionBootstrapRetry,
		);
		expect(authContextValue.handleUsernameEntryRequest).toBe(
			handleUsernameEntryRequest,
		);
		expect(authContextValue.handleUsernameEntryDismiss).toBe(
			handleUsernameEntryDismiss,
		);
	});

	it("keeps username entry closed until it is explicitly requested", () => {
		const requiresUsernameContext = createAuthContextValue({
			snapshot: createAuthSnapshot({
				value: AUTH_STATUS.REQUIRES_USERNAME,
				profile: null,
				errorMessage: "Missing username",
				matchedStates: [AUTH_STATUS.REQUIRES_USERNAME],
			}),
			suggestedUsername: "Rune_AshBearAAAA",
			handleUsernameFormSubmit: vi.fn(),
			handleSessionBootstrapRetry: vi.fn(),
			handleUsernameEntryRequest: vi.fn(),
			handleUsernameEntryDismiss: vi.fn(),
		});

		expect(requiresUsernameContext.isUsernameModalOpen).toBe(false);
		expect(requiresUsernameContext.readyStatusLabel).toBeNull();
		expect(requiresUsernameContext.errorMessage).toBe("Missing username");

		const requestedContext = createAuthContextValue({
			snapshot: {
				...createAuthSnapshot({
					value: AUTH_STATUS.REQUIRES_USERNAME,
					profile: null,
					errorMessage: null,
					matchedStates: [AUTH_STATUS.REQUIRES_USERNAME],
				}),
				context: {
					profile: null,
					errorMessage: null,
					isUsernameEntryRequested: true,
					isUsernameEntryDeferred: false,
				},
			},
			suggestedUsername: "Rune_AshBearAAAA",
			handleUsernameFormSubmit: vi.fn(),
			handleSessionBootstrapRetry: vi.fn(),
			handleUsernameEntryRequest: vi.fn(),
			handleUsernameEntryDismiss: vi.fn(),
		});

		expect(requestedContext.isUsernameModalOpen).toBe(true);

		const submittingContext = createAuthContextValue({
			snapshot: createAuthSnapshot({
				value: AUTH_STATUS.SUBMITTING_USERNAME,
				profile: null,
				errorMessage: null,
				matchedStates: [AUTH_STATUS.SUBMITTING_USERNAME],
			}),
			suggestedUsername: "Rune_AshBearAAAA",
			handleUsernameFormSubmit: vi.fn(),
			handleSessionBootstrapRetry: vi.fn(),
			handleUsernameEntryRequest: vi.fn(),
			handleUsernameEntryDismiss: vi.fn(),
		});

		expect(submittingContext.isUsernameSubmitting).toBe(true);
		expect(submittingContext.isUsernameModalOpen).toBe(true);
	});

	it("opens username modal when entry is requested during session checking", () => {
		const authContextValue = createAuthContextValue({
			snapshot: {
				...createAuthSnapshot({
					value: AUTH_STATUS.CHECKING_SESSION,
					profile: null,
					errorMessage: null,
					matchedStates: [AUTH_STATUS.CHECKING_SESSION],
				}),
				context: {
					profile: null,
					errorMessage: null,
					isUsernameEntryRequested: true,
					isUsernameEntryDeferred: false,
				},
			},
			suggestedUsername: "Rune_AshBearAAAA",
			handleUsernameFormSubmit: vi.fn(),
			handleSessionBootstrapRetry: vi.fn(),
			handleUsernameEntryRequest: vi.fn(),
			handleUsernameEntryDismiss: vi.fn(),
		});

		expect(authContextValue.isCheckingSession).toBe(true);
		expect(authContextValue.isUsernameModalOpen).toBe(true);
	});

	it("keeps the username modal closed when entry is deferred", () => {
		const authContextValue = createAuthContextValue({
			snapshot: {
				...createAuthSnapshot({
					value: AUTH_STATUS.REQUIRES_USERNAME,
					profile: null,
					errorMessage: null,
					matchedStates: [AUTH_STATUS.REQUIRES_USERNAME],
				}),
				context: {
					profile: null,
					errorMessage: null,
					isUsernameEntryRequested: false,
					isUsernameEntryDeferred: true,
				},
			},
			suggestedUsername: "Rune_AshBearAAAA",
			handleUsernameFormSubmit: vi.fn(),
			handleSessionBootstrapRetry: vi.fn(),
			handleUsernameEntryRequest: vi.fn(),
			handleUsernameEntryDismiss: vi.fn(),
		});

		expect(authContextValue.isUsernameModalOpen).toBe(false);
		expect(authContextValue.isAuthenticated).toBe(false);
	});
});
