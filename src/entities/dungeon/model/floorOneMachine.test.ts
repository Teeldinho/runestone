import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import {
	DUNGEON_DEFAULTS,
	DUNGEON_EVENTS,
	FLOOR_IDS,
	ROOM_IDS,
} from "../config";
import { createFloorOneMachine } from "./floorOneMachine";

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
		});
	});

	it("uses ROOM_IDS and DUNGEON_EVENTS transitions through the main path", () => {
		const actor = createActor(createFloorOneMachine()).start();

		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		actor.send({ type: DUNGEON_EVENTS.PICK_UP_KEY });
		actor.send({ type: DUNGEON_EVENTS.ENEMY_DIED });
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });
		actor.send({ type: DUNGEON_EVENTS.ENTER_EXIT });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.EXIT);
	});

	it("keeps guarded doors locked when guard conditions are unmet", () => {
		const actor = createActor(createFloorOneMachine()).start();

		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.GUARD_ROOM);

		actor.send({ type: DUNGEON_EVENTS.PICK_UP_KEY });
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.GUARD_ROOM);
	});

	it("allows RETURN_TO_GUARD_ROOM from EXIT state", () => {
		const actor = createActor(createFloorOneMachine()).start();

		actor.send({ type: DUNGEON_EVENTS.ENTER_LIBRARY });
		actor.send({ type: DUNGEON_EVENTS.ENTER_GUARD_ROOM });
		actor.send({ type: DUNGEON_EVENTS.PICK_UP_KEY });
		actor.send({ type: DUNGEON_EVENTS.ENEMY_DIED });
		actor.send({ type: DUNGEON_EVENTS.ENTER_TREASURY });
		actor.send({ type: DUNGEON_EVENTS.ENTER_EXIT });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.EXIT);

		actor.send({ type: DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM });

		expect(actor.getSnapshot().value).toBe(ROOM_IDS.GUARD_ROOM);
	});
});
