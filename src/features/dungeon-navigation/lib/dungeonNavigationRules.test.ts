import { describe, expect, it } from "vitest";

import type { DungeonContext } from "@/entities/dungeon";
import { DUNGEON_EVENTS, FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";

import {
	createInitialDungeonContext,
	updateDungeonContextRoom,
} from "./dungeonContext";
import { getNavigationActionDisabled } from "./navigationActionAvailability";

const createDungeonContext = (
	overrides?: Partial<DungeonContext>,
): DungeonContext => ({
	currentFloorId: FLOOR_IDS.FLOOR_ONE,
	currentRoomId: ROOM_IDS.ENTRANCE,
	discoveredRooms: [ROOM_IDS.ENTRANCE],
	hasTreasureKey: false,
	enemiesRemaining: 1,
	...overrides,
});

describe("dungeon navigation rules", () => {
	it("creates default context and applies overrides", () => {
		const context = createInitialDungeonContext({
			hasTreasureKey: true,
			enemiesRemaining: 0,
		});

		expect(context).toMatchObject({
			currentFloorId: FLOOR_IDS.FLOOR_ONE,
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			hasTreasureKey: true,
			enemiesRemaining: 0,
		});
	});

	it("updates room context and keeps discovered rooms unique", () => {
		const movedContext = updateDungeonContextRoom(
			createDungeonContext(),
			ROOM_IDS.LIBRARY,
		);

		expect(movedContext.currentRoomId).toBe(ROOM_IDS.LIBRARY);
		expect(movedContext.discoveredRooms).toEqual([
			ROOM_IDS.ENTRANCE,
			ROOM_IDS.LIBRARY,
		]);

		const duplicatedMoveContext = updateDungeonContextRoom(
			movedContext,
			ROOM_IDS.LIBRARY,
		);

		expect(duplicatedMoveContext.discoveredRooms).toEqual([
			ROOM_IDS.ENTRANCE,
			ROOM_IDS.LIBRARY,
		]);
	});

	it("derives navigation action disablement from context", () => {
		const entranceContext = createDungeonContext();

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.ENTER_LIBRARY,
				entranceContext,
			),
		).toBe(false);
		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.ENTER_GUARD_ROOM,
				entranceContext,
			),
		).toBe(true);

		const guardRoomReadyContext = createDungeonContext({
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			discoveredRooms: [
				ROOM_IDS.ENTRANCE,
				ROOM_IDS.LIBRARY,
				ROOM_IDS.GUARD_ROOM,
			],
			hasTreasureKey: true,
			enemiesRemaining: 0,
		});

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.ENTER_TREASURY,
				guardRoomReadyContext,
			),
		).toBe(false);
	});
});
