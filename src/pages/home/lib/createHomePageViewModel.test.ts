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

		expect(viewModel.heroProps.authStatus).toBe(AUTH_STATUS.AUTHENTICATED);
		expect(viewModel.heroProps.errorMessage).toBeNull();
		expect(viewModel.heroProps.isAuthenticated).toBe(true);
		expect(viewModel.heroProps.onEntryRequest).toBe(
			handleUsernameEntryRequest,
		);
		expect(viewModel.heroProps.onRetry).toBe(handleSessionBootstrapRetry);
		expect(viewModel.heroProps.readyStatusLabel).toBe("Rune_AshBearAAAA");
		expect(viewModel.manifestSectionProps.nodes[0]?.indexLabel).toBe("1");
		expect(viewModel.manifestSectionProps.nodes.at(-1)?.isLast).toBe(true);
		expect(viewModel.teachingSectionProps.features[0]?.icon.name).toBe(
			"DoorOpen",
		);
		expect(viewModel.translationRailItems.at(-1)?.isLast).toBe(true);
	});
});
