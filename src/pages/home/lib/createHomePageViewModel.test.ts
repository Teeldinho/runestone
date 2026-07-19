import { describe, expect, it, vi } from "vitest";

import { AUTH_STATUS } from "@/features/auth";

import { createHomePageViewModel } from "./createHomePageViewModel";

describe("createHomePageViewModel", () => {
	it("maps auth and marketing data into page props", () => {
		const handleSessionBootstrapRetry = vi.fn();
		const handleUsernameEntryRequest = vi.fn();

		const viewModel = createHomePageViewModel({
			authStatus: AUTH_STATUS.AUTHENTICATED,
			errorMessage: null,
			handleSessionBootstrapRetry,
			handleUsernameEntryRequest,
			isAuthenticated: true,
			readyStatusLabel: "Rune_AshBearAAAA",
		});

		expect(viewModel.entryProps.authStatus).toBe(AUTH_STATUS.AUTHENTICATED);
		expect(viewModel.entryProps.errorMessage).toBeNull();
		expect(viewModel.entryProps.isAuthenticated).toBe(true);
		expect(viewModel.entryProps.onEntryRequest).toBe(
			handleUsernameEntryRequest,
		);
		expect(viewModel.entryProps.onRetry).toBe(handleSessionBootstrapRetry);
		expect(viewModel.entryProps.readyStatusLabel).toBe("Rune_AshBearAAAA");
	});
});
