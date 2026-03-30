import {
	DUNGEON_CONTEXT_KEYS,
	DUNGEON_DEFAULTS,
	FLOOR_IDS,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
	type RoomId,
} from "../config";
import type { DoorwayFeedback, DungeonMachineContext } from "../model/types";

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
		...clearFloorOneDoorwayFeedback(context),
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
