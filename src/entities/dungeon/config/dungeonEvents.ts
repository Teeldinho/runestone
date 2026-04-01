export type DoorSide = "north" | "south" | "east" | "west";

export type DoorStateKey = `${string}:${DoorSide}`;

export type InteractionType = "key" | "door" | "exit";

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
	OPEN_DOOR: "OPEN_DOOR",
	NEAR_INTERACTABLE: "NEAR_INTERACTABLE",
	LEFT_INTERACTABLE: "LEFT_INTERACTABLE",
} as const;

export type DungeonEvent = (typeof DUNGEON_EVENTS)[keyof typeof DUNGEON_EVENTS];

export type DungeonEventBase = {
	type: DungeonEvent;
};

export type OpenDoorEvent = DungeonEventBase & {
	type: typeof DUNGEON_EVENTS.OPEN_DOOR;
	doorKey: DoorStateKey;
};

export type NearInteractableEvent = DungeonEventBase & {
	type: typeof DUNGEON_EVENTS.NEAR_INTERACTABLE;
	doorKey: DoorStateKey;
	interactableType: InteractionType;
};

export type LeftInteractableEvent = DungeonEventBase & {
	type: typeof DUNGEON_EVENTS.LEFT_INTERACTABLE;
	doorKey: DoorStateKey;
};

export type DungeonEventObject =
	| DungeonEventBase
	| OpenDoorEvent
	| NearInteractableEvent
	| LeftInteractableEvent;
