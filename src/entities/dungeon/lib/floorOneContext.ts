import {
	DUNGEON_DEFAULTS,
	FLOOR_IDS,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
	type RoomId,
} from "../config";
import type { DungeonMachineContext } from "../model/types";

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
		currentFloorId: FLOOR_IDS.FLOOR_ONE,
		currentRoomId: ROOM_IDS.ENTRANCE,
		discoveredRooms: [ROOM_IDS.ENTRANCE],
		hasTreasureKey: false,
		enemiesRemaining: DUNGEON_DEFAULTS.INITIAL_ENEMIES_REMAINING,
		...contextOverrides,
	};
};

export const updateFloorOneContextRoom = (
	context: DungeonMachineContext,
	nextRoomId: RoomId,
): DungeonMachineContext => {
	return {
		...context,
		currentRoomId: nextRoomId,
		discoveredRooms: addDiscoveredRoom(context.discoveredRooms, nextRoomId),
	};
};

export const decrementFloorOneEnemies = (
	context: DungeonMachineContext,
): DungeonMachineContext => {
	return {
		...context,
		enemiesRemaining: Math.max(
			context.enemiesRemaining - FLOOR_ONE_MACHINE_RULES.ENEMY_DECREMENT,
			FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING,
		),
	};
};

export const markFloorOneTreasureKeyCollected = (
	context: DungeonMachineContext,
): DungeonMachineContext => {
	return {
		...context,
		hasTreasureKey: true,
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
