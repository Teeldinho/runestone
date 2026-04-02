import type { DungeonRoomLayout } from "@/entities/room";

export const getRoomWorldPosition = (
	rooms: DungeonRoomLayout[],
	roomId: string,
	spawnHeightOffset: number,
): [number, number, number] | null => {
	const room = rooms.find((r) => r.roomId === roomId);

	if (!room) {
		return null;
	}

	return [room.position[0], spawnHeightOffset, room.position[2]];
};
