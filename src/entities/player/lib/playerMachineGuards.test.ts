import { describe, expect, it } from "vitest";

import { checkLethalDamage, checkPlayerAlive } from "./playerMachineGuards";

describe("checkLethalDamage", () => {
	it("returns true when damage equals remaining hp", () => {
		expect(checkLethalDamage(50, 50)).toBe(true);
	});

	it("returns true when damage exceeds remaining hp", () => {
		expect(checkLethalDamage(50, 75)).toBe(true);
	});

	it("returns false when damage is less than remaining hp", () => {
		expect(checkLethalDamage(50, 25)).toBe(false);
	});

	it("returns false when damage is zero", () => {
		expect(checkLethalDamage(100, 0)).toBe(false);
	});

	it("returns true when hp is already zero", () => {
		expect(checkLethalDamage(0, 0)).toBe(true);
	});
});

describe("checkPlayerAlive", () => {
	it("returns true when hp is positive", () => {
		expect(checkPlayerAlive(1)).toBe(true);
	});

	it("returns true when hp is at maximum", () => {
		expect(checkPlayerAlive(100)).toBe(true);
	});

	it("returns false when hp is zero", () => {
		expect(checkPlayerAlive(0)).toBe(false);
	});

	it("returns false when hp is negative", () => {
		expect(checkPlayerAlive(-1)).toBe(false);
	});
});
