import { describe, expect, it } from "vitest";

import { createFloorOneDungeonRooms } from "./createFloorOneDungeonRooms";

describe("createFloorOneDungeonRooms", () => {
	it("creates the floor-one dungeon room layout", () => {
		const rooms = createFloorOneDungeonRooms();

		expect(rooms.length).toBeGreaterThan(0);
		expect(rooms.every((room) => room.roomId.length > 0)).toBe(true);
	});
});
