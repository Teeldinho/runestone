import {
	ArrowRightLeft,
	DoorOpen,
	Lock,
	MousePointerClick,
	Package,
	Workflow,
} from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { CONCEPTS_SECTION_IDS } from "../config";

import { createConceptsPageViewModel } from "./createConceptsPageViewModel";

describe("createConceptsPageViewModel", () => {
	it("maps auth state into CTA props and section view models", () => {
		const handleUsernameEntryRequest = vi.fn();

		const viewModel = createConceptsPageViewModel({
			handleUsernameEntryRequest,
			isAuthenticated: true,
		});

		expect(viewModel.ctaProps.isAuthenticated).toBe(true);
		expect(viewModel.ctaProps.onEntryRequest).toBe(handleUsernameEntryRequest);
		expect(viewModel.mappingSectionProps.sections[0]?.id).toBe(
			CONCEPTS_SECTION_IDS.STATE,
		);
		expect(viewModel.mappingSectionProps.sections[0]?.icon).toBe(DoorOpen);
		expect(viewModel.mappingSectionProps.sections[1]?.icon).toBe(
			ArrowRightLeft,
		);
		expect(viewModel.mappingSectionProps.sections[2]?.icon).toBe(
			MousePointerClick,
		);
		expect(viewModel.mappingSectionProps.sections[3]?.icon).toBe(Lock);
		expect(viewModel.mappingSectionProps.sections[4]?.icon).toBe(Package);
		expect(viewModel.mappingSectionProps.sections[5]?.icon).toBe(Workflow);
		expect(viewModel.mappingSectionProps.sections[3]?.titleClassName).toBe(
			"text-dungeon-rune-sealed",
		);
		expect(viewModel.mappingSectionProps.sections[3]?.id).toBe(
			CONCEPTS_SECTION_IDS.GUARD,
		);
	});
});
