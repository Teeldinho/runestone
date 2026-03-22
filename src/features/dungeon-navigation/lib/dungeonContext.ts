import type { DungeonContext, RoomId } from "@/entities/dungeon";
import { DUNGEON_DEFAULTS, FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";

const INITIAL_DUNGEON_CONTEXT: DungeonContext = {
	currentFloorId: FLOOR_IDS.FLOOR_ONE,
	currentRoomId: ROOM_IDS.ENTRANCE,
	discoveredRooms: [ROOM_IDS.ENTRANCE],
	hasTreasureKey: false,
	enemiesRemaining: DUNGEON_DEFAULTS.INITIAL_ENEMIES_REMAINING,
};

const addDiscoveredRoom = (
	discoveredRooms: RoomId[],
	nextRoomId: RoomId,
): RoomId[] => {
	if (discoveredRooms.includes(nextRoomId)) {
		return discoveredRooms;
	}

	return [...discoveredRooms, nextRoomId];
};

export const createInitialDungeonContext = (
	contextOverrides?: Partial<DungeonContext>,
): DungeonContext => ({
	...INITIAL_DUNGEON_CONTEXT,
	...contextOverrides,
});

export const updateDungeonContextRoom = (
	context: DungeonContext,
	nextRoomId: RoomId,
): DungeonContext => ({
	...context,
	currentRoomId: nextRoomId,
	discoveredRooms: addDiscoveredRoom(context.discoveredRooms, nextRoomId),
});
