import { describe, expect, it } from "vitest";

import {
	GUARD_LABEL_CAPTURE_PATTERN,
	GUARD_TOKEN_SPLIT_PATTERN,
} from "./machineGraphParsing";

describe("GUARD_LABEL_CAPTURE_PATTERN", () => {
	it("captures content within square brackets", () => {
		const result = "[HealthCheck]".match(GUARD_LABEL_CAPTURE_PATTERN);
		expect(result).not.toBeNull();
		expect(result?.[1]).toBe("HealthCheck");
	});

	it("captures multiple occurrences", () => {
		const input = "[Player] and [Enemy]";
		const matches = input.match(GUARD_LABEL_CAPTURE_PATTERN);
		expect(matches?.[1]).toBe("Player");
	});
});

describe("GUARD_TOKEN_SPLIT_PATTERN", () => {
	it("splits on && operator", () => {
		const result = "isAlive && hasKey".split(GUARD_TOKEN_SPLIT_PATTERN);
		expect(result.map((segment) => segment.trim())).toEqual([
			"isAlive",
			"hasKey",
		]);
	});

	it("splits on comma", () => {
		const result = "a,b,c".split(GUARD_TOKEN_SPLIT_PATTERN);
		expect(result.map((segment) => segment.trim())).toEqual(["a", "b", "c"]);
	});
});
