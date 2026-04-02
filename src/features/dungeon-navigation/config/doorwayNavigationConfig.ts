import {
	type DoorSide,
	DUNGEON_EVENTS,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";

export const DOOR_GUARDS = {
	NONE: "none",
	TREASURY: "treasury",
	EXIT: "exit",
} as const;

type DoorGuard = (typeof DOOR_GUARDS)[keyof typeof DOOR_GUARDS];

type DoorwayInteraction = {
	successEvent: (typeof DUNGEON_EVENTS)[keyof typeof DUNGEON_EVENTS];
	lockedEvent?: (typeof DUNGEON_EVENTS)[keyof typeof DUNGEON_EVENTS];
	guard: DoorGuard;
};

type DoorwayInteractionsByRoom = Partial<
	Record<RoomId, Partial<Record<DoorSide, DoorwayInteraction>>>
>;

export const DOORWAY_NAVIGATION_CONFIG = {
	ARRIVAL_OFFSET: 0.8,
	CHECK_INTERVAL_MS: 90,
	ENTRY_POSITION_EPSILON: 0.001,
	DOOR_PROXIMITY_THRESHOLD: 1.15,
	DOORWAY_HALF_WIDTH: 1.35,
	TRIGGER_COOLDOWN_MS: 280,
} as const;

export const DOORWAY_INTERACTIONS_BY_ROOM: DoorwayInteractionsByRoom = {
	[ROOM_IDS.ENTRANCE]: {
		south: {
			successEvent: DUNGEON_EVENTS.ENTER_LIBRARY,
			guard: DOOR_GUARDS.NONE,
		},
	},
	[ROOM_IDS.LIBRARY]: {
		north: {
			successEvent: DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
			guard: DOOR_GUARDS.NONE,
		},
		south: {
			successEvent: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
			guard: DOOR_GUARDS.NONE,
		},
	},
	[ROOM_IDS.GUARD_ROOM]: {
		north: {
			successEvent: DUNGEON_EVENTS.RETURN_TO_LIBRARY,
			guard: DOOR_GUARDS.NONE,
		},
		south: {
			successEvent: DUNGEON_EVENTS.ENTER_TREASURY,
			lockedEvent: DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT,
			guard: DOOR_GUARDS.TREASURY,
		},
	},
	[ROOM_IDS.TREASURY]: {
		north: {
			successEvent: DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM,
			guard: DOOR_GUARDS.NONE,
		},
		south: {
			successEvent: DUNGEON_EVENTS.ENTER_EXIT,
			lockedEvent: DUNGEON_EVENTS.LOCKED_EXIT_ATTEMPT,
			guard: DOOR_GUARDS.EXIT,
		},
	},
	[ROOM_IDS.EXIT]: {
		north: {
			successEvent: DUNGEON_EVENTS.RETURN_TO_TREASURY,
			guard: DOOR_GUARDS.NONE,
		},
	},
} as const;

export type {
	DoorGuard,
	DoorSide,
	DoorwayInteraction,
	DoorwayInteractionsByRoom,
};
