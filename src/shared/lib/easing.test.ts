import { describe, expect, it } from "vitest";

import { easeInOutCubic, lerpNumber } from "./easing";

describe("easeInOutCubic", () => {
	it("returns 0 at the start", () => {
		expect(easeInOutCubic(0)).toBe(0);
	});

	it("returns 1 at the end", () => {
		expect(easeInOutCubic(1)).toBe(1);
	});

	it("eases around midpoint", () => {
		expect(easeInOutCubic(0.25)).toBe(0.0625);
		expect(easeInOutCubic(0.75)).toBe(0.9375);
	});
});

describe("lerpNumber", () => {
	it("interpolates between values", () => {
		expect(lerpNumber(10, 20, 0.3)).toBe(13);
	});
});
