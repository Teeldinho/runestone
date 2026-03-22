import { assign, setup } from "xstate";

import {
	DUNGEON_DEFAULTS,
	DUNGEON_EVENTS,
	FLOOR_IDS,
	ROOM_IDS,
} from "../config";
import type { DungeonMachineContext, DungeonMachineEvent } from "./types";

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

const addDiscoveredRoom = (
	discoveredRooms: DungeonMachineContext["discoveredRooms"],
	nextRoomId: DungeonMachineContext["currentRoomId"],
): DungeonMachineContext["discoveredRooms"] => {
	if (discoveredRooms.includes(nextRoomId)) {
		return discoveredRooms;
	}

	return [...discoveredRooms, nextRoomId];
};

export const updateFloorOneContextRoom = (
	context: DungeonMachineContext,
	nextRoomId: DungeonMachineContext["currentRoomId"],
): DungeonMachineContext => {
	return {
		...context,
		currentRoomId: nextRoomId,
		discoveredRooms: addDiscoveredRoom(context.discoveredRooms, nextRoomId),
	};
};

export const createFloorOneMachine = (options?: {
	context?: Partial<DungeonMachineContext>;
}) =>
	setup({
		types: {
			context: {} as DungeonMachineContext,
			events: {} as DungeonMachineEvent,
		},
	}).createMachine({
		id: "floorOneMachine",
		initial: ROOM_IDS.ENTRANCE,
		context: createFloorOneContext(options?.context),
		states: {
			[ROOM_IDS.ENTRANCE]: {
				on: {
					[DUNGEON_EVENTS.ENTER_LIBRARY]: {
						target: ROOM_IDS.LIBRARY,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.LIBRARY),
						),
					},
				},
			},
			[ROOM_IDS.LIBRARY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.GUARD_ROOM),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
						target: ROOM_IDS.ENTRANCE,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.ENTRANCE),
						),
					},
				},
			},
			[ROOM_IDS.GUARD_ROOM]: {
				on: {
					[DUNGEON_EVENTS.ENEMY_DIED]: {
						actions: assign(({ context }) => ({
							...context,
							enemiesRemaining: Math.max(context.enemiesRemaining - 1, 0),
						})),
					},
					[DUNGEON_EVENTS.PICK_UP_KEY]: {
						actions: assign(({ context }) => ({
							...context,
							hasTreasureKey: true,
						})),
					},
					[DUNGEON_EVENTS.ENTER_TREASURY]: {
						target: ROOM_IDS.TREASURY,
						guard: ({ context }) =>
							context.hasTreasureKey && context.enemiesRemaining === 0,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.TREASURY),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
						target: ROOM_IDS.ENTRANCE,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.ENTRANCE),
						),
					},
				},
			},
			[ROOM_IDS.TREASURY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_EXIT]: {
						target: ROOM_IDS.EXIT,
						guard: ({ context }) => context.hasTreasureKey,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.EXIT),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.GUARD_ROOM),
						),
					},
				},
			},
			[ROOM_IDS.EXIT]: {
				type: "final",
				on: {
					[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.GUARD_ROOM),
						),
					},
				},
			},
		},
	});
