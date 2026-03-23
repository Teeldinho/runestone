import { describe, expect, it } from "vitest";

import { resolvePlayerPosition } from "./resolvePlayerPosition";

const FALLBACK: [number, number, number] = [5, 0, 5];

describe("resolvePlayerPosition", () => {
	it("returns event.position when present", () => {
		const position: [number, number, number] = [10, 0, 12];
		expect(resolvePlayerPosition({ position }, FALLBACK)).toEqual(position);
	});

	it("returns fallback when position is undefined", () => {
		expect(resolvePlayerPosition({}, FALLBACK)).toEqual(FALLBACK);
	});

	it("returns fallback when event has no position property", () => {
		expect(resolvePlayerPosition({ position: undefined }, FALLBACK)).toEqual(
			FALLBACK,
		);
	});
});
