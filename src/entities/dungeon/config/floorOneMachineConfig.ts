import type { DoorStateKey } from "../model/types";

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
	OPENED_DOORS: "openedDoors",
	NEAR_INTERACTABLE: "nearInteractable",
	NEAR_INTERACTABLE_TYPE: "nearInteractableType",
	LAST_TRANSITION: "lastTransition",
} as const;

export const FLOOR_ONE_GUARDS = {
	doorIsOpened: {} as {
		type: "doorIsOpened";
		params: { doorKey: DoorStateKey };
	},
	treasuryCanBeEntered: {} as { type: "treasuryCanBeEntered" },
	exitCanBeEntered: {} as { type: "exitCanBeEntered" },
} as const;
