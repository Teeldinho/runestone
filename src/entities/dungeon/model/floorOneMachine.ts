import { assign, setup } from "xstate";

import { DUNGEON_EVENTS, ROOM_IDS } from "../config";
import {
	canEnterFloorOneExit,
	canEnterFloorOneTreasury,
	createFloorOneContext,
	decrementFloorOneEnemies,
	markFloorOneTreasureKeyCollected,
	setFloorOneDoorwayFeedback,
	updateFloorOneContextRoom,
} from "../lib";
import type { DungeonMachineContext, DungeonMachineEvent } from "./types";

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
						actions: assign(({ context }) => decrementFloorOneEnemies(context)),
					},
					[DUNGEON_EVENTS.PICK_UP_KEY]: {
						actions: assign(({ context }) =>
							markFloorOneTreasureKeyCollected(context),
						),
					},
					[DUNGEON_EVENTS.ENTER_TREASURY]: {
						target: ROOM_IDS.TREASURY,
						guard: ({ context }) => canEnterFloorOneTreasury(context),
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.TREASURY),
						),
					},
					[DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT]: {
						actions: assign(({ context }) =>
							setFloorOneDoorwayFeedback(
								context,
								DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT,
							),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_LIBRARY]: {
						target: ROOM_IDS.LIBRARY,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.LIBRARY),
						),
					},
				},
			},
			[ROOM_IDS.TREASURY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_EXIT]: {
						target: ROOM_IDS.EXIT,
						guard: ({ context }) => canEnterFloorOneExit(context),
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.EXIT),
						),
					},
					[DUNGEON_EVENTS.LOCKED_EXIT_ATTEMPT]: {
						actions: assign(({ context }) =>
							setFloorOneDoorwayFeedback(
								context,
								DUNGEON_EVENTS.LOCKED_EXIT_ATTEMPT,
							),
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
				on: {
					[DUNGEON_EVENTS.RETURN_TO_TREASURY]: {
						target: ROOM_IDS.TREASURY,
						actions: assign(({ context }) =>
							updateFloorOneContextRoom(context, ROOM_IDS.TREASURY),
						),
					},
				},
			},
		},
	});
