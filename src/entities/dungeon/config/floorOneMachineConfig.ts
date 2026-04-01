import { isDoorOpened } from "../lib/floorOneMachineGuards";
import type { DoorStateKey, DungeonMachineContext } from "../model/types";

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
	doorIsOpened: (
		{ context }: { context: DungeonMachineContext },
		params: { doorKey: DoorStateKey },
	) => isDoorOpened(context, params.doorKey),
	treasuryCanBeEntered: ({ context }: { context: DungeonMachineContext }) => {
		const { hasTreasureKey, enemiesRemaining } = context;
		return hasTreasureKey && enemiesRemaining === 0;
	},
	exitCanBeEntered: ({ context }: { context: DungeonMachineContext }) =>
		context.hasTreasureKey,
} as const;
