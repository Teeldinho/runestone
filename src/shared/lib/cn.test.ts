import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
	it("merges class names and resolves tailwind conflicts", () => {
		expect(cn("p-2", "text-cyan-400", "p-4")).toBe("text-cyan-400 p-4");
	});

	it("ignores falsy values", () => {
		expect(cn("rounded", false, undefined, null, "shadow")).toBe(
			"rounded shadow",
		);
	});
});
