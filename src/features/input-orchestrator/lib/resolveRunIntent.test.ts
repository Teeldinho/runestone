import { describe, expect, it } from "vitest";

import { resolveRunIntent } from "./resolveRunIntent";

describe("resolveRunIntent", () => {
	it("returns the toggle state", () => {
		expect(resolveRunIntent({ isRunToggled: false })).toBe(false);
		expect(resolveRunIntent({ isRunToggled: true })).toBe(true);
	});
});
