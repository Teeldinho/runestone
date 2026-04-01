import { describe, expect, it } from "vitest";

import type { DungeonContext } from "@/entities/dungeon";
import { FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";

import {
	hasCollectedKey,
	hasDefeatedAllEnemies,
	hasReachedLibrary,
} from "./achievementConditions";

const makeContext = (
	overrides: Partial<DungeonContext> = {},
): DungeonContext => ({
	currentFloorId: FLOOR_IDS.FLOOR_ONE,
	currentRoomId: ROOM_IDS.ENTRANCE,
	discoveredRooms: [ROOM_IDS.ENTRANCE],
	hasTreasureKey: false,
	enemiesRemaining: 3,
	openedDoors: [],
	nearInteractable: null,
	nearInteractableType: null,
	lastTransition: null,
	...overrides,
});

describe("hasReachedLibrary", () => {
	it("returns false when Library is not yet discovered", () => {
		const ctx = makeContext({ discoveredRooms: [ROOM_IDS.ENTRANCE] });
		expect(hasReachedLibrary(ctx)).toBe(false);
	});

	it("returns true when Library is in discoveredRooms", () => {
		const ctx = makeContext({
			discoveredRooms: [ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
		});
		expect(hasReachedLibrary(ctx)).toBe(true);
	});
});

describe("hasCollectedKey", () => {
	it("returns false when hasTreasureKey is false", () => {
		const ctx = makeContext({ hasTreasureKey: false });
		expect(hasCollectedKey(ctx)).toBe(false);
	});

	it("returns true when hasTreasureKey is true", () => {
		const ctx = makeContext({ hasTreasureKey: true });
		expect(hasCollectedKey(ctx)).toBe(true);
	});
});

describe("hasDefeatedAllEnemies", () => {
	it("returns false when Guard Room not yet discovered", () => {
		const ctx = makeContext({
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			enemiesRemaining: 0,
		});
		expect(hasDefeatedAllEnemies(ctx)).toBe(false);
	});

	it("returns false when Guard Room discovered but enemies remain", () => {
		const ctx = makeContext({
			discoveredRooms: [
				ROOM_IDS.ENTRANCE,
				ROOM_IDS.LIBRARY,
				ROOM_IDS.GUARD_ROOM,
			],
			enemiesRemaining: 2,
		});
		expect(hasDefeatedAllEnemies(ctx)).toBe(false);
	});

	it("returns true when Guard Room discovered and no enemies remain", () => {
		const ctx = makeContext({
			discoveredRooms: [
				ROOM_IDS.ENTRANCE,
				ROOM_IDS.LIBRARY,
				ROOM_IDS.GUARD_ROOM,
			],
			enemiesRemaining: 0,
		});
		expect(hasDefeatedAllEnemies(ctx)).toBe(true);
	});
});
