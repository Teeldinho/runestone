import { describe, expect, it } from "vitest";
import {
	DUNGEON_RUN_RULE_FIXTURE,
	GAME_PROGRESS_ID,
	GAME_PROGRESS_RULE_FIXTURE,
} from "../model/backendRuleFixtures";

import {
	assertSaveSlotRange,
	createGameProgressSaveResult,
	createGameProgressSnapshot,
} from "./gameProgressRules";
import {
	assertRoomDiscoveryRange,
	assertRunTimingRange,
	assertScoreRange,
	clampLeaderboardLimit,
	createScoreEntry,
} from "./scoreRules";
import { assertValidUsername, formatDiscriminator } from "./userRules";

describe("backend rule utilities", () => {
	it("clamps leaderboard limit and validates scoring bounds", () => {
		expect(clampLeaderboardLimit(0)).toBe(1);
		expect(clampLeaderboardLimit(500)).toBe(50);
		expect(clampLeaderboardLimit(10.9)).toBe(10);

		expect(() => assertScoreRange(-1)).toThrow();
		expect(() => assertScoreRange(200001)).toThrow();
		expect(() => assertScoreRange(1200)).not.toThrow();

		expect(() => assertRunTimingRange(0)).toThrow();
		expect(() => assertRunTimingRange(9000000)).toThrow();
		expect(() => assertRunTimingRange(52000)).not.toThrow();

		expect(() => assertRoomDiscoveryRange(-2)).toThrow();
		expect(() => assertRoomDiscoveryRange(52)).toThrow();
		expect(() => assertRoomDiscoveryRange(5)).not.toThrow();
	});

	it("validates save slots and formats progress payloads", () => {
		expect(() => assertSaveSlotRange(0)).toThrow();
		expect(() => assertSaveSlotRange(4)).toThrow();
		expect(() => assertSaveSlotRange(2)).not.toThrow();

		expect(createGameProgressSnapshot(GAME_PROGRESS_RULE_FIXTURE)).toEqual({
			id: "progress-id",
			userId: "user-id",
			slot: 1,
			snapshot: "{}",
			savedAt: 10,
		});

		expect(createGameProgressSaveResult(GAME_PROGRESS_ID, 20)).toEqual({
			id: "progress-id",
			savedAt: 20,
		});
	});

	it("validates username and discriminator formatting", () => {
		expect(() => assertValidUsername("ab")).toThrow();
		expect(() => assertValidUsername("username-with-dash")).toThrow();
		expect(() => assertValidUsername("runestone_hero")).not.toThrow();

		expect(formatDiscriminator(1)).toBe("#0001");
		expect(formatDiscriminator(42)).toBe("#0042");
	});

	it("maps persisted score runs to score entries", () => {
		expect(createScoreEntry(DUNGEON_RUN_RULE_FIXTURE)).toEqual({
			userId: "user-id",
			username: "Knight",
			discriminator: "#0001",
			floorId: "floor-one",
			score: 1200,
			timeMs: 50000,
			roomsDiscovered: 5,
			completedAt: 100,
		});
	});
});
