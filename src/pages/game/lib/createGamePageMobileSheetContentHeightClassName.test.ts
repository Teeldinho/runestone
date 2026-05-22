import { describe, expect, it } from "vitest";

import { createGamePageMobileSheetContentHeightClassName } from "./createGamePageMobileSheetContentHeightClassName";

describe("createGamePageMobileSheetContentHeightClassName", () => {
	it("builds the drawer content height class from the viewport height", () => {
		expect(createGamePageMobileSheetContentHeightClassName(90)).toBe(
			"h-[90dvh]",
		);
	});
});
