import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import {
	buildDoorKey,
	DUNGEON_EVENTS,
	FLOOR_IDS,
	ROOM_IDS,
} from "@/entities/dungeon";
import { createGameMachine } from "@/features/dungeon-navigation/model/gameMachine";

describe("createGameMachine", () => {
	it("starts in entrance with default context", () => {
		const actor = createActor(createGameMachine()).start();

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.ENTRANCE);
		expect(actor.getSnapshot().context).toMatchObject({
			currentFloorId: FLOOR_IDS.FLOOR_ONE,
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			hasTreasureKey: false,
			enemiesRemaining: 1,
		});
	});

	it("moves from entrance to library", () => {
		const actor = createActor(createGameMachine()).start();

		actor.send({
			type: DUNGEON_EVENTS.OPEN_DOOR,
			doorKey: buildDoorKey(ROOM_IDS.ENTRANCE, "south"),
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.LIBRARY);
		expect(actor.getSnapshot().context.currentRoomId).toBe(ROOM_IDS.LIBRARY);
		expect(actor.getSnapshot().context.discoveredRooms).toContain(
			ROOM_IDS.LIBRARY,
		);
	});

	it("blocks treasury until guard room combat is cleared and key is acquired", () => {
		const actor = createActor(createGameMachine()).start();

		actor.send({
			type: DUNGEON_EVENTS.OPEN_DOOR,
			doorKey: buildDoorKey(ROOM_IDS.ENTRANCE, "south"),
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		actor.send({
			type: DUNGEON_EVENTS.OPEN_DOOR,
			doorKey: buildDoorKey(ROOM_IDS.LIBRARY, "south"),
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		actor.send({
			type: DUNGEON_EVENTS.OPEN_DOOR,
			doorKey: buildDoorKey(ROOM_IDS.GUARD_ROOM, "south"),
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.GUARD_ROOM);
	});

	it("reaches exit after collecting key and clearing guard room", () => {
		const actor = createActor(createGameMachine()).start();

		actor.send({
			type: DUNGEON_EVENTS.OPEN_DOOR,
			doorKey: buildDoorKey(ROOM_IDS.ENTRANCE, "south"),
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		actor.send({
			type: DUNGEON_EVENTS.OPEN_DOOR,
			doorKey: buildDoorKey(ROOM_IDS.LIBRARY, "south"),
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		actor.send({ type: DUNGEON_EVENTS.PICK_UP_KEY });
		actor.send({ type: DUNGEON_EVENTS.ENEMY_DIED });
		actor.send({
			type: DUNGEON_EVENTS.OPEN_DOOR,
			doorKey: buildDoorKey(ROOM_IDS.GUARD_ROOM, "south"),
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });
		actor.send({
			type: DUNGEON_EVENTS.OPEN_DOOR,
			doorKey: buildDoorKey(ROOM_IDS.TREASURY, "south"),
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_EXIT });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.EXIT);
		expect(actor.getSnapshot().context.currentRoomId).toBe(ROOM_IDS.EXIT);
		expect(actor.getSnapshot().context.hasTreasureKey).toBe(true);
		expect(actor.getSnapshot().context.enemiesRemaining).toBe(0);
	});
});
