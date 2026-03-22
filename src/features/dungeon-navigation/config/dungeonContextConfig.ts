import type { DungeonContext } from "@/entities/dungeon";
import { DUNGEON_DEFAULTS, FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";

export const DUNGEON_INITIAL_CONTEXT: DungeonContext = {
	currentFloorId: FLOOR_IDS.FLOOR_ONE,
	currentRoomId: ROOM_IDS.ENTRANCE,
	discoveredRooms: [ROOM_IDS.ENTRANCE],
	hasTreasureKey: false,
	enemiesRemaining: DUNGEON_DEFAULTS.INITIAL_ENEMIES_REMAINING,
};
