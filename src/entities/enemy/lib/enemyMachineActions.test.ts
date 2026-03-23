import { describe, expect, it } from "vitest";

import { applyDamageToEnemy, applyDeathToEnemy } from "./enemyMachineActions";

describe("applyDamageToEnemy", () => {
	it("returns hp minus amount when result is positive", () => {
		expect(applyDamageToEnemy(100, 30)).toBe(70);
	});

	it("returns 0 when damage is lethal", () => {
		expect(applyDamageToEnemy(10, 50)).toBe(0);
	});

	it("returns 0 on exact kill", () => {
		expect(applyDamageToEnemy(20, 20)).toBe(0);
	});

	it("handles zero damage", () => {
		expect(applyDamageToEnemy(50, 0)).toBe(50);
	});
});

describe("applyDeathToEnemy", () => {
	it("returns 0", () => {
		expect(applyDeathToEnemy()).toBe(0);
	});
});
