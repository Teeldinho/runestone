import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import {
	buildDoorKey,
	DOOR_SIDES,
	DUNGEON_EVENTS,
	DUNGEON_INTERACTABLE_IDS,
	FLOOR_IDS,
	INTERACTION_TYPES,
	ROOM_IDS,
} from "@/entities/dungeon";
import { createGameMachine } from "./gameMachine";

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

	it("moves from entrance to library when the doorway is nearby", () => {
		const actor = createActor(createGameMachine()).start();

		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
			interactableType: INTERACTION_TYPES.DOOR,
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.LIBRARY);
		expect(actor.getSnapshot().context.currentRoomId).toBe(ROOM_IDS.LIBRARY);
	});

	it("blocks treasury until guard-room combat is cleared and key is acquired", () => {
		const actor = createActor(createGameMachine()).start();

		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
			interactableType: INTERACTION_TYPES.DOOR,
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH),
			interactableType: INTERACTION_TYPES.DOOR,
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH),
			interactableType: INTERACTION_TYPES.DOOR,
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.GUARD_ROOM);
	});

	it("reaches exit after collecting key and clearing guard room", () => {
		const actor = createActor(createGameMachine()).start();

		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
			interactableType: INTERACTION_TYPES.DOOR,
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH),
			interactableType: INTERACTION_TYPES.DOOR,
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
			interactableType: INTERACTION_TYPES.KEY,
		});
		actor.send({ type: DUNGEON_EVENTS.PICK_UP_KEY });
		actor.send({ type: DUNGEON_EVENTS.ENEMY_DIED });
		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH),
			interactableType: INTERACTION_TYPES.DOOR,
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });
		actor.send({
			type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
			interactableId: buildDoorKey(ROOM_IDS.TREASURY, DOOR_SIDES.SOUTH),
			interactableType: INTERACTION_TYPES.EXIT,
		});
		actor.send({ type: DUNGEON_EVENTS.ENTER_EXIT });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.EXIT);
		expect(actor.getSnapshot().context.currentRoomId).toBe(ROOM_IDS.EXIT);
		expect(actor.getSnapshot().context.hasTreasureKey).toBe(true);
		expect(actor.getSnapshot().context.enemiesRemaining).toBe(0);
	});
});
