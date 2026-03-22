import {
	createFloorOneContext,
	type DungeonContext,
	type RoomId,
	updateFloorOneContextRoom,
} from "@/entities/dungeon";

export const createInitialDungeonContext = (
	contextOverrides?: Partial<DungeonContext>,
): DungeonContext => createFloorOneContext(contextOverrides);

export const updateDungeonContextRoom = (
	context: DungeonContext,
	nextRoomId: RoomId,
): DungeonContext => updateFloorOneContextRoom(context, nextRoomId);
