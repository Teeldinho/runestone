import { describe, expect, it, vi } from "vitest";

import { createConceptsPageViewModel } from "./createConceptsPageViewModel";

describe("createConceptsPageViewModel", () => {
	it("maps auth state into CTA props and section view models", () => {
		const handleUsernameEntryRequest = vi.fn();

		const viewModel = createConceptsPageViewModel({
			handleUsernameEntryRequest,
			isAuthenticated: true,
		});

		expect(viewModel.ctaProps.isAuthenticated).toBe(true);
		expect(viewModel.ctaProps.onEntryRequest).toBe(
			handleUsernameEntryRequest,
		);
		expect(viewModel.mappingSectionProps.sections[0]?.icon.name).toBe(
			"DoorOpen",
		);
		expect(viewModel.mappingSectionProps.sections[3]?.icon.name).toBe("Lock");
		expect(viewModel.mappingSectionProps.sections[3]?.titleClassName).toBe(
			"text-dungeon-rune-sealed",
		);
	});
});
