import { describe, expect, it } from "vitest";

import { isLethalDamage, isPlayerAlive } from "./playerMachineGuards";

describe("isLethalDamage", () => {
	it("returns true when damage equals remaining hp", () => {
		expect(isLethalDamage(50, 50)).toBe(true);
	});

	it("returns true when damage exceeds remaining hp", () => {
		expect(isLethalDamage(50, 75)).toBe(true);
	});

	it("returns false when damage is less than remaining hp", () => {
		expect(isLethalDamage(50, 25)).toBe(false);
	});

	it("returns false when damage is zero", () => {
		expect(isLethalDamage(100, 0)).toBe(false);
	});

	it("returns true when hp is already zero", () => {
		expect(isLethalDamage(0, 0)).toBe(true);
	});
});

describe("isPlayerAlive", () => {
	it("returns true when hp is positive", () => {
		expect(isPlayerAlive(1)).toBe(true);
	});

	it("returns true when hp is at maximum", () => {
		expect(isPlayerAlive(100)).toBe(true);
	});

	it("returns false when hp is zero", () => {
		expect(isPlayerAlive(0)).toBe(false);
	});

	it("returns false when hp is negative", () => {
		expect(isPlayerAlive(-1)).toBe(false);
	});
});
