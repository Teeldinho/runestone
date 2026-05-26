import { describe, expect, it, vi } from "vitest";

import { createTutorialPageViewModel } from "./createTutorialPageViewModel";

describe("createTutorialPageViewModel", () => {
	it("maps auth state into hero props and control view models", () => {
		const handleUsernameEntryRequest = vi.fn();

		const viewModel = createTutorialPageViewModel({
			handleUsernameEntryRequest,
			isAuthenticated: false,
		});

		expect(viewModel.heroProps.isAuthenticated).toBe(false);
		expect(viewModel.heroProps.onEntryRequest).toBe(
			handleUsernameEntryRequest,
		);
		expect(viewModel.controlsSectionProps.controlGroups[0]?.rows[0]?.mobileIcon?.name).toBe(
			"Gamepad2",
		);
		expect(
			viewModel.controlsSectionProps.controlGroups[0]?.rows[1]?.mobileIcon?.name,
		).toBe("Footprints");
		expect(
			viewModel.controlsSectionProps.controlGroups[0]?.rows[2]?.mobileIcon?.name,
		).toBe("ChevronsUp");
		expect(viewModel.firstRunSectionProps.steps[0]?.label).toBe(
			"Enter the initial state",
		);
	});
});
