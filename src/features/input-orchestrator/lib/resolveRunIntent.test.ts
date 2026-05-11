import { describe, expect, it } from "vitest";

import { resolveRunIntent } from "./resolveRunIntent";

describe("resolveRunIntent", () => {
	it("returns false when all inputs are false", () => {
		expect(
			resolveRunIntent({
				isDesktopRunHeld: false,
				isMobileRunToggled: false,
				isMobileMagnitudeRun: false,
			}),
		).toBe(false);
	});

	it("returns true when desktop run is held", () => {
		expect(
			resolveRunIntent({
				isDesktopRunHeld: true,
				isMobileRunToggled: false,
				isMobileMagnitudeRun: false,
			}),
		).toBe(true);
	});

	it("returns true when mobile run is toggled", () => {
		expect(
			resolveRunIntent({
				isDesktopRunHeld: false,
				isMobileRunToggled: true,
				isMobileMagnitudeRun: false,
			}),
		).toBe(true);
	});

	it("returns true when mobile magnitude indicates run", () => {
		expect(
			resolveRunIntent({
				isDesktopRunHeld: false,
				isMobileRunToggled: false,
				isMobileMagnitudeRun: true,
			}),
		).toBe(true);
	});
});
