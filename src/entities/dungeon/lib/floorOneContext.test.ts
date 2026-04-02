import { describe, expect, it } from "vitest";

import {
	DUNGEON_DEFAULTS,
	FLOOR_IDS,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";

import {
	canEnterFloorOneExit,
	canEnterFloorOneTreasury,
	clearFloorOneDoorwayFeedback,
	createFloorOneContext,
	decrementFloorOneEnemies,
	setFloorOneDoorwayFeedback,
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
			lastDoorwayFeedback: null,
			lastTransition: null,
			nearInteractable: null,
			nearInteractableType: null,
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

	it("tracks and clears doorway feedback in context", () => {
		const withFeedback = setFloorOneDoorwayFeedback(
			createFloorOneContext(),
			"LOCKED_DOOR_ATTEMPT",
		);

		expect(withFeedback.lastDoorwayFeedback).toBe("LOCKED_DOOR_ATTEMPT");
		expect(clearFloorOneDoorwayFeedback(withFeedback).lastDoorwayFeedback).toBe(
			null,
		);
	});

	it("decrements remaining enemies and clamps at zero", () => {
		const withOneEnemy = createFloorOneContext({
			enemiesRemaining: FLOOR_ONE_MACHINE_RULES.ENEMY_DECREMENT,
		});

		expect(decrementFloorOneEnemies(withOneEnemy).enemiesRemaining).toBe(
			FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
		);
		expect(
			decrementFloorOneEnemies(createFloorOneContext()).enemiesRemaining,
		).toBe(FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING);
	});

	it("derives floor-one treasury and exit guard checks", () => {
		const blockedContext = createFloorOneContext({
			hasTreasureKey: false,
			enemiesRemaining: FLOOR_ONE_MACHINE_RULES.ENEMY_DECREMENT,
		});
		const unlockedContext = createFloorOneContext({
			hasTreasureKey: true,
			enemiesRemaining: FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
		});

		expect(canEnterFloorOneTreasury(blockedContext)).toBe(false);
		expect(canEnterFloorOneTreasury(unlockedContext)).toBe(true);
		expect(canEnterFloorOneExit(blockedContext)).toBe(false);
		expect(canEnterFloorOneExit(unlockedContext)).toBe(true);
	});
});
