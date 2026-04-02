import { describe, expect, it } from "vitest";

import { DOOR_SIDES, ROOM_IDS } from "@/entities/dungeon";

import { getDoorwayArrivalPosition } from "./getDoorwayArrivalPosition";

describe("getDoorwayArrivalPosition", () => {
	it("places arrival just inside the destination north doorway", () => {
		expect(
			getDoorwayArrivalPosition({
				currentRoomPosition: [0, 0, 20],
				lastTransition: {
					fromRoom: ROOM_IDS.ENTRANCE,
					toRoom: ROOM_IDS.LIBRARY,
					doorSide: DOOR_SIDES.NORTH,
				},
				spawnHeightOffset: 0.45,
			}),
		).toEqual([0, 0.45, 14.8]);
	});

	it("falls back to the room center when rooms are not axis-adjacent", () => {
		expect(
			getDoorwayArrivalPosition({
				currentRoomPosition: [10, 0, 10],
				lastTransition: null,
				spawnHeightOffset: 0.45,
			}),
		).toEqual([10, 0.45, 10]);
	});
});
