import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import {
	DOOR_SIDES,
	DUNGEON_DEFAULTS,
	DUNGEON_EVENTS,
	DUNGEON_INTERACTABLE_IDS,
	FLOOR_IDS,
	INTERACTION_TYPES,
	ROOM_IDS,
} from "../config";
import { buildDoorKey } from "../lib";
import { createFloorOneMachine } from "./floorOneMachine";

type FloorOneMachineActor = ReturnType<
	typeof createActor<ReturnType<typeof createFloorOneMachine>>
>;

const sendNearDoor = (
	actor: FloorOneMachineActor,
	roomId: (typeof ROOM_IDS)[keyof typeof ROOM_IDS],
	doorSide: (typeof DOOR_SIDES)[keyof typeof DOOR_SIDES],
	interactableType: (typeof INTERACTION_TYPES)[keyof typeof INTERACTION_TYPES] = INTERACTION_TYPES.DOOR,
) => {
	actor.send({
		type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
		interactableId: buildDoorKey(roomId, doorSide),
		interactableType,
	});
};

const sendNearTreasureKey = (actor: FloorOneMachineActor) => {
	actor.send({
		type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
		interactableId: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
		interactableType: INTERACTION_TYPES.KEY,
	});
};

describe("createFloorOneMachine", () => {
	it("starts from the configured entrance room context", () => {
		const actor = createActor(createFloorOneMachine()).start();
		const snapshot = actor.getSnapshot();

		expect(snapshot.value).toBe(ROOM_IDS.ENTRANCE);
		expect(snapshot.context).toEqual({
			currentFloorId: FLOOR_IDS.FLOOR_ONE,
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			hasTreasureKey: false,
			enemiesRemaining: DUNGEON_DEFAULTS.INITIAL_ENEMIES_REMAINING,
			lastDoorwayFeedback: null,
			nearInteractable: null,
			nearInteractableType: null,
			lastTransition: null,
		});
	});

	it("requires proximity for room traversal and records lastTransition on success", () => {
		const actor = createActor(createFloorOneMachine()).start();

		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		expect(actor.getSnapshot().value).toBe(ROOM_IDS.ENTRANCE);

		sendNearDoor(actor, ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.LIBRARY);
		expect(actor.getSnapshot().context.lastTransition).toEqual({
			fromRoom: ROOM_IDS.ENTRANCE,
			toRoom: ROOM_IDS.LIBRARY,
			doorSide: DOOR_SIDES.NORTH,
		});
		expect(actor.getSnapshot().context.nearInteractable).toBeNull();
	});

	it("uses the full F-only traversal path through the dungeon", () => {
		const actor = createActor(createFloorOneMachine()).start();

		sendNearDoor(actor, ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		sendNearDoor(actor, ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		sendNearTreasureKey(actor);
		actor.send({ type: DUNGEON_EVENTS.PICK_UP_KEY });
		actor.send({ type: DUNGEON_EVENTS.ENEMY_DIED });
		sendNearDoor(actor, ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });
		sendNearDoor(
			actor,
			ROOM_IDS.TREASURY,
			DOOR_SIDES.SOUTH,
			INTERACTION_TYPES.EXIT,
		);
		actor.send({ type: DUNGEON_EVENTS.ENTER_EXIT });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.EXIT);
	});

	it("keeps guarded doors locked when guard conditions are unmet", () => {
		const actor = createActor(createFloorOneMachine()).start();

		sendNearDoor(actor, ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		sendNearDoor(actor, ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		sendNearDoor(actor, ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.GUARD_ROOM);

		sendNearTreasureKey(actor);
		actor.send({ type: DUNGEON_EVENTS.PICK_UP_KEY });
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.GUARD_ROOM);
	});

	it("records locked doorway feedback without changing rooms", () => {
		const actor = createActor(createFloorOneMachine()).start();

		sendNearDoor(actor, ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		sendNearDoor(actor, ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		actor.send({ type: DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.GUARD_ROOM);
		expect(actor.getSnapshot().context.lastDoorwayFeedback).toBe(
			DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT,
		);
	});

	it("allows backtracking once the matching doorway is nearby", () => {
		const actor = createActor(createFloorOneMachine()).start();

		sendNearDoor(actor, ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		sendNearDoor(actor, ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH);
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		sendNearDoor(actor, ROOM_IDS.GUARD_ROOM, DOOR_SIDES.NORTH);
		actor.send({ type: DUNGEON_EVENTS.RETURN_TO_LIBRARY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.LIBRARY);
		expect(actor.getSnapshot().context.lastTransition).toEqual({
			fromRoom: ROOM_IDS.GUARD_ROOM,
			toRoom: ROOM_IDS.LIBRARY,
			doorSide: DOOR_SIDES.SOUTH,
		});
	});
});
