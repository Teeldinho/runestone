// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { shouldBlockLookFromPointerTarget } from "./shouldBlockLookFromPointerTarget";

describe("shouldBlockLookFromPointerTarget", () => {
	it("returns false for null target", () => {
		expect(shouldBlockLookFromPointerTarget({ target: null })).toBe(false);
	});

	it("returns false for non-HTMLElement target", () => {
		const textNode = document.createTextNode("text");

		expect(shouldBlockLookFromPointerTarget({ target: textNode })).toBe(false);
	});

	it("returns true when target is inside a blocking element", () => {
		const container = document.createElement("div");

		container.setAttribute("data-input-blocks-look", "true");

		const child = document.createElement("button");

		container.appendChild(child);

		expect(shouldBlockLookFromPointerTarget({ target: child })).toBe(true);
	});

	it("returns false when target is outside blocking zone", () => {
		const element = document.createElement("div");

		element.setAttribute("data-input-blocks-look", "false");

		expect(shouldBlockLookFromPointerTarget({ target: element })).toBe(false);
	});
});
