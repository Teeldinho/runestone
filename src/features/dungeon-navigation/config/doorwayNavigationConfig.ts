import { DUNGEON_EVENTS, ROOM_IDS, type RoomId } from "@/entities/dungeon";

type DoorSide = "north" | "south" | "east" | "west";

type DoorGuard = "none" | "treasury" | "exit";

type DoorwayInteraction = {
	successEvent: (typeof DUNGEON_EVENTS)[keyof typeof DUNGEON_EVENTS];
	lockedEvent?: (typeof DUNGEON_EVENTS)[keyof typeof DUNGEON_EVENTS];
	guard: DoorGuard;
};

type DoorwayInteractionsByRoom = Partial<
	Record<RoomId, Partial<Record<DoorSide, DoorwayInteraction>>>
>;

export const DOORWAY_NAVIGATION_CONFIG = {
	CHECK_INTERVAL_MS: 90,
	DOOR_PROXIMITY_THRESHOLD: 1.15,
	DOORWAY_HALF_WIDTH: 1.35,
	TRIGGER_COOLDOWN_MS: 280,
} as const;

export const DOORWAY_INTERACTIONS_BY_ROOM: DoorwayInteractionsByRoom = {
	[ROOM_IDS.ENTRANCE]: {
		south: {
			successEvent: DUNGEON_EVENTS.ENTER_LIBRARY,
			guard: "none",
		},
	},
	[ROOM_IDS.LIBRARY]: {
		north: {
			successEvent: DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
			guard: "none",
		},
		south: {
			successEvent: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
			guard: "none",
		},
	},
	[ROOM_IDS.GUARD_ROOM]: {
		north: {
			successEvent: DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
			guard: "none",
		},
		south: {
			successEvent: DUNGEON_EVENTS.ENTER_TREASURY,
			lockedEvent: DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT,
			guard: "treasury",
		},
	},
	[ROOM_IDS.TREASURY]: {
		north: {
			successEvent: DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM,
			guard: "none",
		},
		south: {
			successEvent: DUNGEON_EVENTS.ENTER_EXIT,
			lockedEvent: DUNGEON_EVENTS.LOCKED_EXIT_ATTEMPT,
			guard: "exit",
		},
	},
	[ROOM_IDS.EXIT]: {
		north: {
			successEvent: DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM,
			guard: "none",
		},
	},
} as const;

export type {
	DoorGuard,
	DoorSide,
	DoorwayInteraction,
	DoorwayInteractionsByRoom,
};
