import type { DungeonContext } from "@/entities/dungeon";
import {
	DUNGEON_EVENTS,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";

import type { NavigationActionEvent } from "../config";

export const getNavigationActionDisabled = (
	eventType: NavigationActionEvent,
	context: DungeonContext,
): boolean => {
	switch (eventType) {
		case DUNGEON_EVENTS.ENTER_LIBRARY:
			return context.currentRoomId !== ROOM_IDS.ENTRANCE;
		case DUNGEON_EVENTS.ENTER_GUARD_ROOM:
			return context.currentRoomId !== ROOM_IDS.LIBRARY;
		case DUNGEON_EVENTS.PICK_UP_KEY:
			return (
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM || context.hasTreasureKey
			);
		case DUNGEON_EVENTS.ENEMY_DIED:
			return (
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM ||
				context.enemiesRemaining ===
					FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING
			);
		case DUNGEON_EVENTS.ENTER_TREASURY:
			return (
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM ||
				!context.hasTreasureKey ||
				context.enemiesRemaining > 0
			);
		case DUNGEON_EVENTS.ENTER_EXIT:
			return (
				context.currentRoomId !== ROOM_IDS.TREASURY || !context.hasTreasureKey
			);
		case DUNGEON_EVENTS.RETURN_TO_ENTRANCE:
			return context.currentRoomId !== ROOM_IDS.LIBRARY;
		case DUNGEON_EVENTS.RETURN_TO_LIBRARY:
			return context.currentRoomId !== ROOM_IDS.GUARD_ROOM;
		case DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM:
			return context.currentRoomId !== ROOM_IDS.TREASURY;
		case DUNGEON_EVENTS.RETURN_TO_TREASURY:
			return context.currentRoomId !== ROOM_IDS.EXIT;
		default:
			return true;
	}
};
