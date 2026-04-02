import { describe, expect, it } from "vitest";

import type { PlayerStats } from "../model/types";
import { applyDamage, applyDeath, applyHeal } from "./playerMachineActions";

const baseStats: PlayerStats = {
	maxHp: 100,
	hp: 100,
	score: 0,
	keyCount: 0,
	chainMultiplier: 1,
};

describe("applyDamage", () => {
	it("reduces hp by the given amount", () => {
		const result = applyDamage(baseStats, 30);
		expect(result.hp).toBe(70);
	});

	it("preserves all other stats fields", () => {
		const result = applyDamage(baseStats, 10);
		expect(result.maxHp).toBe(baseStats.maxHp);
		expect(result.score).toBe(baseStats.score);
		expect(result.keyCount).toBe(baseStats.keyCount);
		expect(result.chainMultiplier).toBe(baseStats.chainMultiplier);
	});

	it("does not mutate the input stats", () => {
		const stats = { ...baseStats, hp: 80 };
		applyDamage(stats, 10);
		expect(stats.hp).toBe(80);
	});
});

describe("applyHeal", () => {
	it("increases hp by the given amount", () => {
		const stats = { ...baseStats, hp: 50 };
		const result = applyHeal(stats, 30, 100);
		expect(result.hp).toBe(80);
	});

	it("clamps hp to maxHp when heal would exceed it", () => {
		const stats = { ...baseStats, hp: 90 };
		const result = applyHeal(stats, 50, 100);
		expect(result.hp).toBe(100);
	});

	it("preserves all other stats fields", () => {
		const stats = { ...baseStats, hp: 50 };
		const result = applyHeal(stats, 10, 100);
		expect(result.maxHp).toBe(stats.maxHp);
		expect(result.score).toBe(stats.score);
		expect(result.keyCount).toBe(stats.keyCount);
		expect(result.chainMultiplier).toBe(stats.chainMultiplier);
	});

	it("does not mutate the input stats", () => {
		const stats = { ...baseStats, hp: 50 };
		applyHeal(stats, 10, 100);
		expect(stats.hp).toBe(50);
	});
});

describe("applyDeath", () => {
	it("sets hp to zero", () => {
		const result = applyDeath(baseStats);
		expect(result.hp).toBe(0);
	});

	it("preserves all other stats fields", () => {
		const result = applyDeath(baseStats);
		expect(result.maxHp).toBe(baseStats.maxHp);
		expect(result.score).toBe(baseStats.score);
		expect(result.keyCount).toBe(baseStats.keyCount);
		expect(result.chainMultiplier).toBe(baseStats.chainMultiplier);
	});

	it("does not mutate the input stats", () => {
		const stats = { ...baseStats, hp: 50 };
		applyDeath(stats);
		expect(stats.hp).toBe(50);
	});
});
