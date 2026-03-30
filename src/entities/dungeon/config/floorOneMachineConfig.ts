export const FLOOR_ONE_MACHINE_RULES = {
	ENEMY_DECREMENT: 1,
	NO_ENEMIES_REMAINING: 0,
} as const;

export const DUNGEON_CONTEXT_KEYS = {
	CURRENT_FLOOR_ID: "currentFloorId",
	CURRENT_ROOM_ID: "currentRoomId",
	DISCOVERED_ROOMS: "discoveredRooms",
	HAS_TREASURE_KEY: "hasTreasureKey",
	ENEMIES_REMAINING: "enemiesRemaining",
	LAST_DOORWAY_FEEDBACK: "lastDoorwayFeedback",
} as const;
