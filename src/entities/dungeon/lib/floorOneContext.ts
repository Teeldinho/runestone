import {
	type DoorSide,
	DUNGEON_CONTEXT_KEYS,
	DUNGEON_DEFAULTS,
	FLOOR_IDS,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
	type RoomId,
} from "../config";
import type {
	DoorwayFeedback,
	DungeonInteractableId,
	DungeonMachineContext,
	InteractionType,
	LastTransition,
} from "../model/types";

const addDiscoveredRoom = (
	discoveredRooms: DungeonMachineContext["discoveredRooms"],
	nextRoomId: RoomId,
): DungeonMachineContext["discoveredRooms"] => {
	if (discoveredRooms.includes(nextRoomId)) {
		return discoveredRooms;
	}

	return [...discoveredRooms, nextRoomId];
};

export const createFloorOneContext = (
	contextOverrides?: Partial<DungeonMachineContext>,
): DungeonMachineContext => {
	return {
		[DUNGEON_CONTEXT_KEYS.CURRENT_FLOOR_ID]: FLOOR_IDS.FLOOR_ONE,
		[DUNGEON_CONTEXT_KEYS.CURRENT_ROOM_ID]: ROOM_IDS.ENTRANCE,
		[DUNGEON_CONTEXT_KEYS.DISCOVERED_ROOMS]: [ROOM_IDS.ENTRANCE],
		[DUNGEON_CONTEXT_KEYS.HAS_TREASURE_KEY]: false,
		[DUNGEON_CONTEXT_KEYS.ENEMIES_REMAINING]:
			DUNGEON_DEFAULTS.INITIAL_ENEMIES_REMAINING,
		[DUNGEON_CONTEXT_KEYS.LAST_DOORWAY_FEEDBACK]: null,
		[DUNGEON_CONTEXT_KEYS.NEAR_INTERACTABLE]: null,
		[DUNGEON_CONTEXT_KEYS.NEAR_INTERACTABLE_TYPE]: null,
		[DUNGEON_CONTEXT_KEYS.LAST_TRANSITION]: null,
		...contextOverrides,
	};
};

export const clearFloorOneDoorwayFeedback = (
	context: DungeonMachineContext,
): DungeonMachineContext => {
	return {
		...context,
		[DUNGEON_CONTEXT_KEYS.LAST_DOORWAY_FEEDBACK]: null,
	};
};

export const updateFloorOneContextRoom = (
	context: DungeonMachineContext,
	nextRoomId: RoomId,
): DungeonMachineContext => {
	return {
		...clearFloorOneDoorwayFeedback(context),
		[DUNGEON_CONTEXT_KEYS.NEAR_INTERACTABLE]: null,
		[DUNGEON_CONTEXT_KEYS.NEAR_INTERACTABLE_TYPE]: null,
		[DUNGEON_CONTEXT_KEYS.CURRENT_ROOM_ID]: nextRoomId,
		[DUNGEON_CONTEXT_KEYS.DISCOVERED_ROOMS]: addDiscoveredRoom(
			context.discoveredRooms,
			nextRoomId,
		),
	};
};

export const decrementFloorOneEnemies = (
	context: DungeonMachineContext,
): DungeonMachineContext => {
	return {
		...context,
		[DUNGEON_CONTEXT_KEYS.ENEMIES_REMAINING]: Math.max(
			context.enemiesRemaining - FLOOR_ONE_MACHINE_RULES.ENEMY_DECREMENT,
			FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
		),
	};
};

export const markFloorOneTreasureKeyCollected = (
	context: DungeonMachineContext,
): DungeonMachineContext => {
	return {
		...clearFloorOneNearInteractable(clearFloorOneDoorwayFeedback(context)),
		[DUNGEON_CONTEXT_KEYS.HAS_TREASURE_KEY]: true,
	};
};

export const setFloorOneDoorwayFeedback = (
	context: DungeonMachineContext,
	feedback: DoorwayFeedback,
): DungeonMachineContext => {
	return {
		...context,
		[DUNGEON_CONTEXT_KEYS.LAST_DOORWAY_FEEDBACK]: feedback,
	};
};

export const canEnterFloorOneTreasury = (
	context: DungeonMachineContext,
): boolean => {
	return (
		context.hasTreasureKey &&
		context.enemiesRemaining === FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING
	);
};

export const canEnterFloorOneExit = (
	context: DungeonMachineContext,
): boolean => {
	return context.hasTreasureKey;
};

export const setFloorOneNearInteractable = (
	context: DungeonMachineContext,
	interactableId: DungeonInteractableId,
	interactableType: InteractionType,
): DungeonMachineContext => {
	return {
		...context,
		[DUNGEON_CONTEXT_KEYS.NEAR_INTERACTABLE]: interactableId,
		[DUNGEON_CONTEXT_KEYS.NEAR_INTERACTABLE_TYPE]: interactableType,
	};
};

export const clearFloorOneNearInteractable = (
	context: DungeonMachineContext,
): DungeonMachineContext => {
	return {
		...context,
		[DUNGEON_CONTEXT_KEYS.NEAR_INTERACTABLE]: null,
		[DUNGEON_CONTEXT_KEYS.NEAR_INTERACTABLE_TYPE]: null,
	};
};

export const trackFloorOneTransition = (
	context: DungeonMachineContext,
	fromRoom: RoomId,
	toRoom: RoomId,
	doorSide: DoorSide,
): DungeonMachineContext => {
	return {
		...context,
		[DUNGEON_CONTEXT_KEYS.LAST_TRANSITION]: {
			fromRoom,
			toRoom,
			doorSide,
		},
	};
};

export const transitionFloorOneContextRoom = (
	context: DungeonMachineContext,
	transition: LastTransition,
): DungeonMachineContext => {
	return trackFloorOneTransition(
		updateFloorOneContextRoom(context, transition.toRoom),
		transition.fromRoom,
		transition.toRoom,
		transition.doorSide,
	);
};
