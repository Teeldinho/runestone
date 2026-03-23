import { describe, expect, it } from "vitest";
import { resolveToggleLabel } from "./resolveToggleLabel";

describe("resolveToggleLabel", () => {
	it("returns onLabel when enabled is true", () => {
		expect(resolveToggleLabel(true, "On", "Off")).toBe("On");
	});

	it("returns offLabel when enabled is false", () => {
		expect(resolveToggleLabel(false, "On", "Off")).toBe("Off");
	});

	it("works with different label values", () => {
		expect(resolveToggleLabel(true, "Enabled", "Disabled")).toBe("Enabled");
		expect(resolveToggleLabel(false, "Enabled", "Disabled")).toBe("Disabled");
	});
});
