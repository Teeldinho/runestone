import { describe, expect, it } from "vitest";

import { RUNESTONE_LOGO_SEGMENT_IDS, RUNESTONE_LOGO_VARIANTS } from "../config";

import { createRunestoneLogoViewModel } from "./createRunestoneLogoViewModel";

describe("createRunestoneLogoViewModel", () => {
	it("creates the desktop logo model", () => {
		const viewModel = createRunestoneLogoViewModel({
			variant: RUNESTONE_LOGO_VARIANTS.DESKTOP,
		});

		expect(viewModel.ariaLabel).toBe("RUNESTONE");
		expect(viewModel.wordmarkClassName).toContain("tracking-[0.28em]");
		expect(viewModel.segments).toEqual([
			{
				className: "text-primary",
				id: RUNESTONE_LOGO_SEGMENT_IDS.RUNE,
				label: "RUNE",
			},
			{
				className: "text-accent",
				id: RUNESTONE_LOGO_SEGMENT_IDS.STONE,
				label: "STONE",
			},
		]);
	});

	it("creates the compact logo model", () => {
		const viewModel = createRunestoneLogoViewModel({
			variant: RUNESTONE_LOGO_VARIANTS.COMPACT,
		});

		expect(viewModel.wordmarkClassName).toContain("tracking-[0.2em]");
		expect(viewModel.segments).toEqual([
			{
				className: "text-primary",
				id: RUNESTONE_LOGO_SEGMENT_IDS.RUNE,
				label: "R",
			},
			{
				className: "text-accent",
				id: RUNESTONE_LOGO_SEGMENT_IDS.STONE,
				label: "S",
			},
		]);
	});
});
