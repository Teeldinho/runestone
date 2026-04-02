import { describe, expect, it } from "vitest";

import {
	DOOR_SIDES,
	DUNGEON_EVENTS,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";

import { resolveDoorwayNavigationEvent } from "./doorwayNavigation";

describe("resolveDoorwayNavigationEvent", () => {
	it("returns null when player is not near a doorway", () => {
		expect(
			resolveDoorwayNavigationEvent({
				currentRoomId: ROOM_IDS.ENTRANCE,
				roomCenterPosition: [0, 0, 0],
				playerPosition: [0, 0, 0],
				hasTreasureKey: false,
				enemiesRemaining: 1,
			}),
		).toBeNull();
	});

	it("triggers entrance to library event from south doorway", () => {
		expect(
			resolveDoorwayNavigationEvent({
				currentRoomId: ROOM_IDS.ENTRANCE,
				roomCenterPosition: [0, 0, 0],
				playerPosition: [0, 0, 6],
				hasTreasureKey: false,
				enemiesRemaining: 1,
			}),
		).toEqual({
			eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
			isLocked: false,
			doorSide: DOOR_SIDES.SOUTH,
		});
	});

	it("returns a locked-door event for treasury when guard conditions fail", () => {
		expect(
			resolveDoorwayNavigationEvent({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				roomCenterPosition: [0, 0, 0],
				playerPosition: [0, 0, 6],
				hasTreasureKey: false,
				enemiesRemaining: 1,
			}),
		).toEqual({
			eventType: DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT,
			isLocked: true,
			doorSide: DOOR_SIDES.SOUTH,
		});
	});

	it("returns enter-treasury event when key is collected and enemies are cleared", () => {
		expect(
			resolveDoorwayNavigationEvent({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				roomCenterPosition: [0, 0, 0],
				playerPosition: [0, 0, 6],
				hasTreasureKey: true,
				enemiesRemaining: FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
			}),
		).toEqual({
			eventType: DUNGEON_EVENTS.ENTER_TREASURY,
			isLocked: false,
			doorSide: DOOR_SIDES.SOUTH,
		});
	});

	it("uses adjacent return event for guard-room north doorway", () => {
		expect(
			resolveDoorwayNavigationEvent({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				roomCenterPosition: [0, 0, 0],
				playerPosition: [0, 0, -6],
				hasTreasureKey: true,
				enemiesRemaining: FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
			}),
		).toEqual({
			eventType: DUNGEON_EVENTS.RETURN_TO_LIBRARY,
			isLocked: false,
			doorSide: DOOR_SIDES.NORTH,
		});
	});

	it("returns locked exit attempt when treasury exit remains sealed", () => {
		expect(
			resolveDoorwayNavigationEvent({
				currentRoomId: ROOM_IDS.TREASURY,
				roomCenterPosition: [0, 0, 20],
				playerPosition: [0, 0, 26],
				hasTreasureKey: false,
				enemiesRemaining: FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
			}),
		).toEqual({
			eventType: DUNGEON_EVENTS.LOCKED_EXIT_ATTEMPT,
			isLocked: true,
			doorSide: DOOR_SIDES.SOUTH,
		});
	});

	it("uses adjacent return event for exit north doorway", () => {
		expect(
			resolveDoorwayNavigationEvent({
				currentRoomId: ROOM_IDS.EXIT,
				roomCenterPosition: [0, 0, 40],
				playerPosition: [0, 0, 34],
				hasTreasureKey: true,
				enemiesRemaining: FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
			}),
		).toEqual({
			eventType: DUNGEON_EVENTS.RETURN_TO_TREASURY,
			isLocked: false,
			doorSide: DOOR_SIDES.NORTH,
		});
	});
});
