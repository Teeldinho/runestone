import type { DungeonContext } from "@/entities/dungeon";
import {
	buildDoorKey,
	DOOR_SIDES,
	DUNGEON_EVENTS,
	DUNGEON_INTERACTABLE_IDS,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";

import type { NavigationActionEvent } from "../config";

type NavigationActionAvailabilityContext = Pick<
	DungeonContext,
	"currentRoomId" | "enemiesRemaining" | "hasTreasureKey" | "nearInteractable"
>;

export const getNavigationActionDisabled = (
	eventType: NavigationActionEvent,
	context: NavigationActionAvailabilityContext,
): boolean => {
	switch (eventType) {
		case DUNGEON_EVENTS.ENTER_LIBRARY:
			return (
				context.currentRoomId !== ROOM_IDS.ENTRANCE ||
				context.nearInteractable !==
					buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH)
			);
		case DUNGEON_EVENTS.ENTER_GUARD_ROOM:
			return (
				context.currentRoomId !== ROOM_IDS.LIBRARY ||
				context.nearInteractable !==
					buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH)
			);
		case DUNGEON_EVENTS.PICK_UP_KEY:
			return (
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM ||
				context.hasTreasureKey ||
				context.nearInteractable !== DUNGEON_INTERACTABLE_IDS.TREASURE_KEY
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
				context.enemiesRemaining > 0 ||
				context.nearInteractable !==
					buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH)
			);
		case DUNGEON_EVENTS.ENTER_EXIT:
			return (
				context.currentRoomId !== ROOM_IDS.TREASURY ||
				!context.hasTreasureKey ||
				context.nearInteractable !==
					buildDoorKey(ROOM_IDS.TREASURY, DOOR_SIDES.SOUTH)
			);
		case DUNGEON_EVENTS.RETURN_TO_ENTRANCE:
			return (
				context.currentRoomId !== ROOM_IDS.LIBRARY ||
				context.nearInteractable !==
					buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.NORTH)
			);
		case DUNGEON_EVENTS.RETURN_TO_LIBRARY:
			return (
				context.currentRoomId !== ROOM_IDS.GUARD_ROOM ||
				context.nearInteractable !==
					buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.NORTH)
			);
		case DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM:
			return (
				context.currentRoomId !== ROOM_IDS.TREASURY ||
				context.nearInteractable !==
					buildDoorKey(ROOM_IDS.TREASURY, DOOR_SIDES.NORTH)
			);
		case DUNGEON_EVENTS.RETURN_TO_TREASURY:
			return (
				context.currentRoomId !== ROOM_IDS.EXIT ||
				context.nearInteractable !==
					buildDoorKey(ROOM_IDS.EXIT, DOOR_SIDES.NORTH)
			);
		default:
			return true;
	}
};
