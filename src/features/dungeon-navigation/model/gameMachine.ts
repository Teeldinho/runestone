import { assign, setup } from "xstate";

import {
	DUNGEON_EVENTS,
	type DungeonContext,
	type DungeonMachineEvent,
	FLOOR_IDS,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";

const INITIAL_CONTEXT: DungeonContext = {
	currentFloorId: FLOOR_IDS.FLOOR_ONE,
	currentRoomId: ROOM_IDS.ENTRANCE,
	discoveredRooms: [ROOM_IDS.ENTRANCE],
	hasTreasureKey: false,
	enemiesRemaining: 1,
};

const addDiscoveredRoom = (
	discoveredRooms: RoomId[],
	nextRoomId: RoomId,
): RoomId[] => {
	if (discoveredRooms.includes(nextRoomId)) {
		return discoveredRooms;
	}

	return [...discoveredRooms, nextRoomId];
};

const updateRoomContext = (
	context: DungeonContext,
	nextRoomId: RoomId,
): DungeonContext => ({
	...context,
	currentRoomId: nextRoomId,
	discoveredRooms: addDiscoveredRoom(context.discoveredRooms, nextRoomId),
});

const createInitialContext = (
	contextOverrides?: Partial<DungeonContext>,
): DungeonContext => ({
	...INITIAL_CONTEXT,
	...contextOverrides,
});

export const createGameMachine = (options?: {
	context?: Partial<DungeonContext>;
}) =>
	setup({
		types: {
			context: {} as DungeonContext,
			events: {} as DungeonMachineEvent,
		},
	}).createMachine({
		id: "dungeonNavigationMachine",
		initial: ROOM_IDS.ENTRANCE,
		context: createInitialContext(options?.context),
		states: {
			[ROOM_IDS.ENTRANCE]: {
				on: {
					[DUNGEON_EVENTS.ENTER_LIBRARY]: {
						target: ROOM_IDS.LIBRARY,
						actions: assign(({ context }) =>
							updateRoomContext(context, ROOM_IDS.LIBRARY),
						),
					},
				},
			},
			[ROOM_IDS.LIBRARY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateRoomContext(context, ROOM_IDS.GUARD_ROOM),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
						target: ROOM_IDS.ENTRANCE,
						actions: assign(({ context }) =>
							updateRoomContext(context, ROOM_IDS.ENTRANCE),
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
							updateRoomContext(context, ROOM_IDS.TREASURY),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
						target: ROOM_IDS.ENTRANCE,
						actions: assign(({ context }) =>
							updateRoomContext(context, ROOM_IDS.ENTRANCE),
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
							updateRoomContext(context, ROOM_IDS.EXIT),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateRoomContext(context, ROOM_IDS.GUARD_ROOM),
						),
					},
				},
			},
			[ROOM_IDS.EXIT]: {
				on: {
					[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateRoomContext(context, ROOM_IDS.GUARD_ROOM),
						),
					},
				},
			},
		},
	});
