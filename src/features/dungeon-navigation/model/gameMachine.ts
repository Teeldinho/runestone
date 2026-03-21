import { assign, setup } from "xstate";

import {
	DUNGEON_EVENTS,
	type DungeonContext,
	ROOM_IDS,
} from "@/entities/dungeon";
import {
	DUNGEON_MACHINE_SYSTEM_EVENTS,
	type GameMachineEvent,
} from "../config";
import {
	createInitialDungeonContext,
	updateDungeonContextRoom,
} from "../lib/dungeonContext";

export const createGameMachine = (options?: {
	context?: Partial<DungeonContext>;
}) =>
	setup({
		types: {
			context: {} as DungeonContext,
			events: {} as GameMachineEvent,
		},
	}).createMachine({
		id: "dungeonNavigationMachine",
		initial: ROOM_IDS.ENTRANCE,
		context: createInitialDungeonContext(options?.context),
		on: {
			[DUNGEON_MACHINE_SYSTEM_EVENTS.RESET_DUNGEON_RUN]: {
				target: `.${ROOM_IDS.ENTRANCE}`,
				actions: assign(() => createInitialDungeonContext(options?.context)),
			},
		},
		states: {
			[ROOM_IDS.ENTRANCE]: {
				on: {
					[DUNGEON_EVENTS.ENTER_LIBRARY]: {
						target: ROOM_IDS.LIBRARY,
						actions: assign(({ context }) =>
							updateDungeonContextRoom(context, ROOM_IDS.LIBRARY),
						),
					},
				},
			},
			[ROOM_IDS.LIBRARY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateDungeonContextRoom(context, ROOM_IDS.GUARD_ROOM),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
						target: ROOM_IDS.ENTRANCE,
						actions: assign(({ context }) =>
							updateDungeonContextRoom(context, ROOM_IDS.ENTRANCE),
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
							updateDungeonContextRoom(context, ROOM_IDS.TREASURY),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
						target: ROOM_IDS.ENTRANCE,
						actions: assign(({ context }) =>
							updateDungeonContextRoom(context, ROOM_IDS.ENTRANCE),
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
							updateDungeonContextRoom(context, ROOM_IDS.EXIT),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateDungeonContextRoom(context, ROOM_IDS.GUARD_ROOM),
						),
					},
				},
			},
			[ROOM_IDS.EXIT]: {
				on: {
					[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						actions: assign(({ context }) =>
							updateDungeonContextRoom(context, ROOM_IDS.GUARD_ROOM),
						),
					},
				},
			},
		},
	});
