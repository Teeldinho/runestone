export const DOOR_SIDES = {
	NORTH: "north",
	SOUTH: "south",
	EAST: "east",
	WEST: "west",
} as const;

export type DoorSide = (typeof DOOR_SIDES)[keyof typeof DOOR_SIDES];

export const DOOR_SIDE_LABELS: Record<DoorSide, string> = {
	[DOOR_SIDES.NORTH]: "North",
	[DOOR_SIDES.SOUTH]: "South",
	[DOOR_SIDES.EAST]: "East",
	[DOOR_SIDES.WEST]: "West",
};

export type DoorStateKey = `${string}:${DoorSide}`;

export const INTERACTION_TYPES = {
	KEY: "key",
	DOOR: "door",
	EXIT: "exit",
} as const;

export type InteractionType =
	(typeof INTERACTION_TYPES)[keyof typeof INTERACTION_TYPES];

export const DUNGEON_INTERACTABLE_IDS = {
	TREASURE_KEY: "treasureKey",
} as const;

export type DungeonInteractableId =
	| DoorStateKey
	| (typeof DUNGEON_INTERACTABLE_IDS)[keyof typeof DUNGEON_INTERACTABLE_IDS];

export const INTERACTABLE_ID_LABELS: Record<
	(typeof DUNGEON_INTERACTABLE_IDS)[keyof typeof DUNGEON_INTERACTABLE_IDS],
	string
> = {
	[DUNGEON_INTERACTABLE_IDS.TREASURE_KEY]: "Treasure Key",
};

export const DUNGEON_EVENTS = {
	ENTER_LIBRARY: "ENTER_LIBRARY",
	ENTER_GUARD_ROOM: "ENTER_GUARD_ROOM",
	ENTER_TREASURY: "ENTER_TREASURY",
	ENTER_EXIT: "ENTER_EXIT",
	PICK_UP_KEY: "PICK_UP_KEY",
	ENEMY_DIED: "ENEMY_DIED",
	LOCKED_DOOR_ATTEMPT: "LOCKED_DOOR_ATTEMPT",
	LOCKED_EXIT_ATTEMPT: "LOCKED_EXIT_ATTEMPT",
	RETURN_TO_ENTRANCE: "RETURN_TO_ENTRANCE",
	RETURN_TO_LIBRARY: "RETURN_TO_LIBRARY",
	RETURN_TO_GUARD_ROOM: "RETURN_TO_GUARD_ROOM",
	RETURN_TO_TREASURY: "RETURN_TO_TREASURY",
	NEAR_INTERACTABLE: "NEAR_INTERACTABLE",
	LEFT_INTERACTABLE: "LEFT_INTERACTABLE",
} as const;

export type DungeonEvent = (typeof DUNGEON_EVENTS)[keyof typeof DUNGEON_EVENTS];

export type DungeonEventBase = {
	type: DungeonEvent;
};

export type NearInteractableEvent = DungeonEventBase & {
	type: typeof DUNGEON_EVENTS.NEAR_INTERACTABLE;
	interactableId: DungeonInteractableId;
	interactableType: InteractionType;
};

export type LeftInteractableEvent = DungeonEventBase & {
	type: typeof DUNGEON_EVENTS.LEFT_INTERACTABLE;
	interactableId: DungeonInteractableId;
};

export type DungeonEventObject =
	| DungeonEventBase
	| NearInteractableEvent
	| LeftInteractableEvent;
