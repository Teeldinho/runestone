import { describe, expect, it } from "vitest";

import { deduplicateErrorMessages } from "./errorHelpers";

describe("deduplicateErrorMessages", () => {
	it("returns unique messages from error array", () => {
		const errors = [
			{ message: "Required" },
			{ message: "Too short" },
			{ message: "Required" },
		];

		expect(deduplicateErrorMessages(errors)).toEqual(["Required", "Too short"]);
	});

	it("filters out entries without a message", () => {
		const errors = [
			{ message: "Required" },
			undefined,
			{ message: undefined },
			{ message: "Too short" },
		];

		expect(deduplicateErrorMessages(errors)).toEqual(["Required", "Too short"]);
	});

	it("returns empty array for empty input", () => {
		expect(deduplicateErrorMessages([])).toEqual([]);
	});

	it("returns empty array when all entries lack messages", () => {
		expect(
			deduplicateErrorMessages([undefined, { message: undefined }]),
		).toEqual([]);
	});

	it("preserves insertion order for first occurrence", () => {
		const errors = [
			{ message: "B" },
			{ message: "A" },
			{ message: "B" },
			{ message: "C" },
		];

		expect(deduplicateErrorMessages(errors)).toEqual(["B", "A", "C"]);
	});
});
