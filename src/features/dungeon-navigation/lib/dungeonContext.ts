import type { DungeonContext, RoomId } from "@/entities/dungeon";
import { DUNGEON_INITIAL_CONTEXT } from "@/features/dungeon-navigation/config";

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
	...DUNGEON_INITIAL_CONTEXT,
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
