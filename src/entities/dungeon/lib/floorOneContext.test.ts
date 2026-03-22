import { describe, expect, it } from "vitest";

import { DUNGEON_DEFAULTS, FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";

import {
	canEnterFloorOneExit,
	canEnterFloorOneTreasury,
	createFloorOneContext,
	decrementFloorOneEnemies,
	updateFloorOneContextRoom,
} from "./floorOneContext";

describe("floorOneContext", () => {
	it("creates the default floor-one context", () => {
		expect(createFloorOneContext()).toEqual({
			currentFloorId: FLOOR_IDS.FLOOR_ONE,
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			hasTreasureKey: false,
			enemiesRemaining: DUNGEON_DEFAULTS.INITIAL_ENEMIES_REMAINING,
		});
	});

	it("updates room context while keeping discovered rooms unique", () => {
		const movedToLibrary = updateFloorOneContextRoom(
			createFloorOneContext(),
			ROOM_IDS.LIBRARY,
		);

		expect(movedToLibrary.currentRoomId).toBe(ROOM_IDS.LIBRARY);
		expect(movedToLibrary.discoveredRooms).toEqual([
			ROOM_IDS.ENTRANCE,
			ROOM_IDS.LIBRARY,
		]);

		const movedToLibraryAgain = updateFloorOneContextRoom(
			movedToLibrary,
			ROOM_IDS.LIBRARY,
		);

		expect(movedToLibraryAgain.discoveredRooms).toEqual([
			ROOM_IDS.ENTRANCE,
			ROOM_IDS.LIBRARY,
		]);
	});

	it("decrements remaining enemies and clamps at zero", () => {
		const withOneEnemy = createFloorOneContext({
			enemiesRemaining: 1,
		});

		expect(decrementFloorOneEnemies(withOneEnemy).enemiesRemaining).toBe(0);
		expect(
			decrementFloorOneEnemies(createFloorOneContext()).enemiesRemaining,
		).toBe(0);
	});

	it("derives floor-one treasury and exit guard checks", () => {
		const blockedContext = createFloorOneContext({
			hasTreasureKey: false,
			enemiesRemaining: 1,
		});
		const unlockedContext = createFloorOneContext({
			hasTreasureKey: true,
			enemiesRemaining: 0,
		});

		expect(canEnterFloorOneTreasury(blockedContext)).toBe(false);
		expect(canEnterFloorOneTreasury(unlockedContext)).toBe(true);
		expect(canEnterFloorOneExit(blockedContext)).toBe(false);
		expect(canEnterFloorOneExit(unlockedContext)).toBe(true);
	});
});
