import { describe, expect, it } from "vitest";

import {
	DUNGEON_EVENTS,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";

import { getNavigationActionDisabled } from "./navigationActionAvailability";

const baseContext = {
	currentFloorId: "floor-one" as const,
	currentRoomId: ROOM_IDS.ENTRANCE,
	discoveredRooms: [ROOM_IDS.ENTRANCE],
	hasTreasureKey: false,
	enemiesRemaining: 1,
};

describe("getNavigationActionDisabled — ENTER_LIBRARY", () => {
	it("is enabled when in entrance", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.ENTRANCE };
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_LIBRARY, ctx)).toBe(
			false,
		);
	});

	it("is disabled when not in entrance", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.LIBRARY };
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_LIBRARY, ctx)).toBe(
			true,
		);
	});
});

describe("getNavigationActionDisabled — ENTER_GUARD_ROOM", () => {
	it("is enabled when in library", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.LIBRARY };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_GUARD_ROOM, ctx),
		).toBe(false);
	});

	it("is disabled when not in library", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.ENTRANCE };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_GUARD_ROOM, ctx),
		).toBe(true);
	});
});

describe("getNavigationActionDisabled — PICK_UP_KEY", () => {
	it("is enabled when in guard room and key not yet collected", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			hasTreasureKey: false,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.PICK_UP_KEY, ctx)).toBe(
			false,
		);
	});

	it("is disabled when not in guard room", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.LIBRARY,
			hasTreasureKey: false,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.PICK_UP_KEY, ctx)).toBe(
			true,
		);
	});

	it("is disabled when key already collected", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			hasTreasureKey: true,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.PICK_UP_KEY, ctx)).toBe(
			true,
		);
	});
});

describe("getNavigationActionDisabled — ENEMY_DIED", () => {
	it("is enabled when in guard room with enemies remaining", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			enemiesRemaining: 1,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.ENEMY_DIED, ctx)).toBe(
			false,
		);
	});

	it("is disabled when not in guard room", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.LIBRARY,
			enemiesRemaining: 1,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.ENEMY_DIED, ctx)).toBe(
			true,
		);
	});

	it("is disabled when no enemies remaining", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			enemiesRemaining: FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.ENEMY_DIED, ctx)).toBe(
			true,
		);
	});
});

describe("getNavigationActionDisabled — ENTER_TREASURY", () => {
	it("is enabled when in guard room, key collected, no enemies remaining", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			hasTreasureKey: true,
			enemiesRemaining: 0,
		};
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_TREASURY, ctx),
		).toBe(false);
	});

	it("is disabled when not in guard room", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.LIBRARY,
			hasTreasureKey: true,
			enemiesRemaining: 0,
		};
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_TREASURY, ctx),
		).toBe(true);
	});

	it("is disabled when key not collected", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			hasTreasureKey: false,
			enemiesRemaining: 0,
		};
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_TREASURY, ctx),
		).toBe(true);
	});

	it("is disabled when enemies still remaining", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			hasTreasureKey: true,
			enemiesRemaining: 1,
		};
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_TREASURY, ctx),
		).toBe(true);
	});
});

describe("getNavigationActionDisabled — ENTER_EXIT", () => {
	it("is enabled when in treasury with key", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.TREASURY,
			hasTreasureKey: true,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_EXIT, ctx)).toBe(
			false,
		);
	});

	it("is disabled when not in treasury", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			hasTreasureKey: true,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_EXIT, ctx)).toBe(
			true,
		);
	});

	it("is disabled when key not collected", () => {
		const ctx = {
			...baseContext,
			currentRoomId: ROOM_IDS.TREASURY,
			hasTreasureKey: false,
		};
		expect(getNavigationActionDisabled(DUNGEON_EVENTS.ENTER_EXIT, ctx)).toBe(
			true,
		);
	});
});

describe("getNavigationActionDisabled — RETURN_TO_ENTRANCE", () => {
	it("is enabled when in library", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.LIBRARY };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.RETURN_TO_ENTRANCE, ctx),
		).toBe(false);
	});

	it("is enabled when in guard room", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.GUARD_ROOM };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.RETURN_TO_ENTRANCE, ctx),
		).toBe(false);
	});

	it("is disabled when in entrance", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.ENTRANCE };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.RETURN_TO_ENTRANCE, ctx),
		).toBe(true);
	});

	it("is disabled when in treasury", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.TREASURY };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.RETURN_TO_ENTRANCE, ctx),
		).toBe(true);
	});
});

describe("getNavigationActionDisabled — RETURN_TO_GUARD_ROOM", () => {
	it("is enabled when in treasury", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.TREASURY };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM, ctx),
		).toBe(false);
	});

	it("is enabled when in exit", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.EXIT };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM, ctx),
		).toBe(false);
	});

	it("is disabled when in guard room", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.GUARD_ROOM };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM, ctx),
		).toBe(true);
	});

	it("is disabled when in library", () => {
		const ctx = { ...baseContext, currentRoomId: ROOM_IDS.LIBRARY };
		expect(
			getNavigationActionDisabled(DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM, ctx),
		).toBe(true);
	});
});
