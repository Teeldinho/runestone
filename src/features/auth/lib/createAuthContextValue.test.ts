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
	},
	matches: (status: string) => matchedStates.includes(status),
});

describe("createAuthContextValue", () => {
	it("builds authenticated context state with ready label", () => {
		const handleUsernameFormSubmit = vi.fn();
		const handleSessionBootstrapRetry = vi.fn();
		const snapshot = createAuthSnapshot({
			value: AUTH_STATUS.AUTHENTICATED,
			profile: TEST_USER_PROFILE,
			errorMessage: null,
			matchedStates: [AUTH_STATUS.AUTHENTICATED],
		});

		const authContextValue = createAuthContextValue({
			snapshot,
			handleUsernameFormSubmit,
			handleSessionBootstrapRetry,
		});

		expect(authContextValue.authStatus).toBe(AUTH_STATUS.AUTHENTICATED);
		expect(authContextValue.authenticatedProfile).toBe(TEST_USER_PROFILE);
		expect(authContextValue.isAuthenticated).toBe(true);
		expect(authContextValue.isCheckingSession).toBe(false);
		expect(authContextValue.isUsernameSubmitting).toBe(false);
		expect(authContextValue.isUsernameModalOpen).toBe(false);
		expect(authContextValue.readyStatusLabel).toBe("runestone_hero0001");
		expect(authContextValue.handleUsernameFormSubmit).toBe(
			handleUsernameFormSubmit,
		);
		expect(authContextValue.handleSessionBootstrapRetry).toBe(
			handleSessionBootstrapRetry,
		);
	});

	it("opens username modal for requires-username and submitting states", () => {
		const requiresUsernameContext = createAuthContextValue({
			snapshot: createAuthSnapshot({
				value: AUTH_STATUS.REQUIRES_USERNAME,
				profile: null,
				errorMessage: "Missing username",
				matchedStates: [AUTH_STATUS.REQUIRES_USERNAME],
			}),
			handleUsernameFormSubmit: vi.fn(),
			handleSessionBootstrapRetry: vi.fn(),
		});

		expect(requiresUsernameContext.isUsernameModalOpen).toBe(true);
		expect(requiresUsernameContext.readyStatusLabel).toBeNull();
		expect(requiresUsernameContext.errorMessage).toBe("Missing username");

		const submittingContext = createAuthContextValue({
			snapshot: createAuthSnapshot({
				value: AUTH_STATUS.SUBMITTING_USERNAME,
				profile: null,
				errorMessage: null,
				matchedStates: [AUTH_STATUS.SUBMITTING_USERNAME],
			}),
			handleUsernameFormSubmit: vi.fn(),
			handleSessionBootstrapRetry: vi.fn(),
		});

		expect(submittingContext.isUsernameSubmitting).toBe(true);
		expect(submittingContext.isUsernameModalOpen).toBe(true);
	});
});
