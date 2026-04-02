import { describe, expect, it } from "vitest";

import type { DungeonContext } from "@/entities/dungeon";
import {
	buildDoorKey,
	DOOR_SIDES,
	DUNGEON_DEFAULTS,
	DUNGEON_EVENTS,
	DUNGEON_INTERACTABLE_IDS,
	FLOOR_IDS,
	ROOM_IDS,
} from "@/entities/dungeon";

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
	enemiesRemaining: DUNGEON_DEFAULTS.INITIAL_ENEMIES_REMAINING,
	nearInteractable: null,
	nearInteractableType: null,
	lastTransition: null,
	...overrides,
});

describe("dungeon navigation rules", () => {
	it("creates default context and applies overrides", () => {
		const defaultContext = createInitialDungeonContext();

		expect(defaultContext.enemiesRemaining).toBe(
			DUNGEON_DEFAULTS.INITIAL_ENEMIES_REMAINING,
		);

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
		const entranceContext = createDungeonContext({
			nearInteractable: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
		});

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
			nearInteractable: buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH),
		});

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.ENTER_TREASURY,
				guardRoomReadyContext,
			),
		).toBe(false);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.PICK_UP_KEY,
				createDungeonContext({
					currentRoomId: ROOM_IDS.GUARD_ROOM,
					hasTreasureKey: false,
					nearInteractable: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
				}),
			),
		).toBe(false);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.PICK_UP_KEY,
				createDungeonContext({
					currentRoomId: ROOM_IDS.GUARD_ROOM,
					hasTreasureKey: true,
				}),
			),
		).toBe(true);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.ENEMY_DIED,
				createDungeonContext({
					currentRoomId: ROOM_IDS.GUARD_ROOM,
					enemiesRemaining: 1,
				}),
			),
		).toBe(false);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.ENEMY_DIED,
				createDungeonContext({
					currentRoomId: ROOM_IDS.GUARD_ROOM,
					enemiesRemaining: 0,
				}),
			),
		).toBe(true);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.ENTER_EXIT,
				createDungeonContext({
					currentRoomId: ROOM_IDS.TREASURY,
					hasTreasureKey: true,
					nearInteractable: buildDoorKey(ROOM_IDS.TREASURY, DOOR_SIDES.SOUTH),
				}),
			),
		).toBe(false);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.ENTER_EXIT,
				createDungeonContext({
					currentRoomId: ROOM_IDS.TREASURY,
					hasTreasureKey: false,
				}),
			),
		).toBe(true);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
				createDungeonContext({
					currentRoomId: ROOM_IDS.LIBRARY,
					nearInteractable: buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.NORTH),
				}),
			),
		).toBe(false);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
				createDungeonContext({ currentRoomId: ROOM_IDS.GUARD_ROOM }),
			),
		).toBe(true);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.RETURN_TO_LIBRARY,
				createDungeonContext({
					currentRoomId: ROOM_IDS.GUARD_ROOM,
					nearInteractable: buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.NORTH),
				}),
			),
		).toBe(false);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.RETURN_TO_LIBRARY,
				createDungeonContext({ currentRoomId: ROOM_IDS.LIBRARY }),
			),
		).toBe(true);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM,
				createDungeonContext({
					currentRoomId: ROOM_IDS.TREASURY,
					nearInteractable: buildDoorKey(ROOM_IDS.TREASURY, DOOR_SIDES.NORTH),
				}),
			),
		).toBe(false);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM,
				createDungeonContext({ currentRoomId: ROOM_IDS.EXIT }),
			),
		).toBe(true);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.RETURN_TO_TREASURY,
				createDungeonContext({
					currentRoomId: ROOM_IDS.EXIT,
					nearInteractable: buildDoorKey(ROOM_IDS.EXIT, DOOR_SIDES.NORTH),
				}),
			),
		).toBe(false);

		expect(
			getNavigationActionDisabled(
				DUNGEON_EVENTS.RETURN_TO_TREASURY,
				createDungeonContext({ currentRoomId: ROOM_IDS.TREASURY }),
			),
		).toBe(true);

		expect(
			getNavigationActionDisabled(
				"UNKNOWN_EVENT" as Parameters<typeof getNavigationActionDisabled>[0],
				entranceContext,
			),
		).toBe(true);
	});
});
