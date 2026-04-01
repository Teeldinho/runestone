import { DUNGEON_EVENTS, ROOM_IDS } from "@/entities/dungeon";

export const NAVIGATION_ACTION_EVENTS = [
	DUNGEON_EVENTS.ENTER_LIBRARY,
	DUNGEON_EVENTS.ENTER_GUARD_ROOM,
	DUNGEON_EVENTS.PICK_UP_KEY,
	DUNGEON_EVENTS.ENEMY_DIED,
	DUNGEON_EVENTS.ENTER_TREASURY,
	DUNGEON_EVENTS.ENTER_EXIT,
	DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
	DUNGEON_EVENTS.RETURN_TO_LIBRARY,
	DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM,
	DUNGEON_EVENTS.RETURN_TO_TREASURY,
] as const;

export type NavigationActionEvent = (typeof NAVIGATION_ACTION_EVENTS)[number];

export const NAVIGATION_ACTION_LABELS: Record<NavigationActionEvent, string> = {
	[DUNGEON_EVENTS.ENTER_LIBRARY]: "Enter Library",
	[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: "Enter Guard Room",
	[DUNGEON_EVENTS.PICK_UP_KEY]: "Pick Up Key",
	[DUNGEON_EVENTS.ENEMY_DIED]: "Defeat Enemy",
	[DUNGEON_EVENTS.ENTER_TREASURY]: "Enter Treasury",
	[DUNGEON_EVENTS.ENTER_EXIT]: "Enter Exit",
	[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: "Return to Entrance",
	[DUNGEON_EVENTS.RETURN_TO_LIBRARY]: "Return to Library",
	[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: "Return to Guard Room",
	[DUNGEON_EVENTS.RETURN_TO_TREASURY]: "Return to Treasury",
};

type DoorDirection = "north" | "south" | "east" | "west";

export const DOOR_TRANSITION_MAP: Record<
	string,
	{ roomId: string; direction: DoorDirection }
> = {
	[DUNGEON_EVENTS.ENTER_LIBRARY]: {
		roomId: ROOM_IDS.ENTRANCE,
		direction: "south",
	},
	[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: {
		roomId: ROOM_IDS.LIBRARY,
		direction: "south",
	},
	[DUNGEON_EVENTS.ENTER_TREASURY]: {
		roomId: ROOM_IDS.GUARD_ROOM,
		direction: "south",
	},
	[DUNGEON_EVENTS.ENTER_EXIT]: {
		roomId: ROOM_IDS.TREASURY,
		direction: "south",
	},
	[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
		roomId: ROOM_IDS.LIBRARY,
		direction: "north",
	},
	[DUNGEON_EVENTS.RETURN_TO_LIBRARY]: {
		roomId: ROOM_IDS.GUARD_ROOM,
		direction: "north",
	},
	[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
		roomId: ROOM_IDS.TREASURY,
		direction: "north",
	},
	[DUNGEON_EVENTS.RETURN_TO_TREASURY]: {
		roomId: ROOM_IDS.EXIT,
		direction: "north",
	},
} as const;
