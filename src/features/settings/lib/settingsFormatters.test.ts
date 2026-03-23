import { describe, expect, it } from "vitest";
import { formatVolumePercent } from "./settingsFormatters";

describe("formatVolumePercent", () => {
	it("formats 0 as 0%", () => {
		expect(formatVolumePercent(0)).toBe("0%");
	});

	it("formats 1 as 100%", () => {
		expect(formatVolumePercent(1)).toBe("100%");
	});

	it("formats 0.55 as 55%", () => {
		expect(formatVolumePercent(0.55)).toBe("55%");
	});

	it("rounds fractional results (0.556 → 56%)", () => {
		expect(formatVolumePercent(0.556)).toBe("56%");
	});
});
