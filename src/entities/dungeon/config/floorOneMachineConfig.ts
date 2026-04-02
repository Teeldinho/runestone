import { ROOM_IDS, type RoomId } from "./dungeonConfig";
import {
	DOOR_SIDES,
	type DoorSide,
	DUNGEON_EVENTS,
	type DungeonEvent,
} from "./dungeonEvents";

export const FLOOR_ONE_MACHINE_RULES = {
	ENEMY_DECREMENT: 1,
	NO_ENEMIES_REMAINING: 0,
} as const;

export const DUNGEON_MACHINE_IDS = {
	FLOOR_ONE: "floorOneMachine",
	NAVIGATION: "dungeonNavigationMachine",
} as const;

export const DUNGEON_CONTEXT_KEYS = {
	CURRENT_FLOOR_ID: "currentFloorId",
	CURRENT_ROOM_ID: "currentRoomId",
	DISCOVERED_ROOMS: "discoveredRooms",
	HAS_TREASURE_KEY: "hasTreasureKey",
	ENEMIES_REMAINING: "enemiesRemaining",
	LAST_DOORWAY_FEEDBACK: "lastDoorwayFeedback",
	NEAR_INTERACTABLE: "nearInteractable",
	NEAR_INTERACTABLE_TYPE: "nearInteractableType",
	LAST_TRANSITION: "lastTransition",
} as const;

export const FLOOR_ONE_GUARD_KEYS = {
	IS_NEAR_INTERACTABLE: "isNearInteractable",
	CAN_PICK_UP_TREASURE_KEY: "canPickUpTreasureKey",
	TREASURY_CAN_BE_ENTERED: "treasuryCanBeEntered",
	EXIT_CAN_BE_ENTERED: "exitCanBeEntered",
} as const;

type FloorOneEventDoorTransition = {
	fromRoom: RoomId;
	toRoom: RoomId;
	departureDoorSide: DoorSide;
	arrivalDoorSide: DoorSide;
};

export const FLOOR_ONE_EVENT_DOOR_TRANSITIONS: Partial<
	Record<DungeonEvent, FloorOneEventDoorTransition>
> = {
	[DUNGEON_EVENTS.ENTER_LIBRARY]: {
		fromRoom: ROOM_IDS.ENTRANCE,
		toRoom: ROOM_IDS.LIBRARY,
		departureDoorSide: DOOR_SIDES.SOUTH,
		arrivalDoorSide: DOOR_SIDES.NORTH,
	},
	[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: {
		fromRoom: ROOM_IDS.LIBRARY,
		toRoom: ROOM_IDS.GUARD_ROOM,
		departureDoorSide: DOOR_SIDES.SOUTH,
		arrivalDoorSide: DOOR_SIDES.NORTH,
	},
	[DUNGEON_EVENTS.ENTER_TREASURY]: {
		fromRoom: ROOM_IDS.GUARD_ROOM,
		toRoom: ROOM_IDS.TREASURY,
		departureDoorSide: DOOR_SIDES.SOUTH,
		arrivalDoorSide: DOOR_SIDES.NORTH,
	},
	[DUNGEON_EVENTS.ENTER_EXIT]: {
		fromRoom: ROOM_IDS.TREASURY,
		toRoom: ROOM_IDS.EXIT,
		departureDoorSide: DOOR_SIDES.SOUTH,
		arrivalDoorSide: DOOR_SIDES.NORTH,
	},
	[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
		fromRoom: ROOM_IDS.LIBRARY,
		toRoom: ROOM_IDS.ENTRANCE,
		departureDoorSide: DOOR_SIDES.NORTH,
		arrivalDoorSide: DOOR_SIDES.SOUTH,
	},
	[DUNGEON_EVENTS.RETURN_TO_LIBRARY]: {
		fromRoom: ROOM_IDS.GUARD_ROOM,
		toRoom: ROOM_IDS.LIBRARY,
		departureDoorSide: DOOR_SIDES.NORTH,
		arrivalDoorSide: DOOR_SIDES.SOUTH,
	},
	[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
		fromRoom: ROOM_IDS.TREASURY,
		toRoom: ROOM_IDS.GUARD_ROOM,
		departureDoorSide: DOOR_SIDES.NORTH,
		arrivalDoorSide: DOOR_SIDES.SOUTH,
	},
	[DUNGEON_EVENTS.RETURN_TO_TREASURY]: {
		fromRoom: ROOM_IDS.EXIT,
		toRoom: ROOM_IDS.TREASURY,
		departureDoorSide: DOOR_SIDES.NORTH,
		arrivalDoorSide: DOOR_SIDES.SOUTH,
	},
} as const;

export type { FloorOneEventDoorTransition };
