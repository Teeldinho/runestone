import { assign, setup } from "xstate";

import { DUNGEON_EVENTS, ROOM_IDS } from "../config";
import {
	buildDoorKey,
	canEnterFloorOneExit,
	canEnterFloorOneTreasury,
	clearFloorOneNearInteractable,
	createFloorOneContext,
	decrementFloorOneEnemies,
	isDoorOpened,
	markFloorOneTreasureKeyCollected,
	openFloorOneDoor,
	setFloorOneDoorwayFeedback,
	setFloorOneNearInteractable,
	updateFloorOneContextRoom,
} from "../lib";
import type {
	DoorStateKey,
	DungeonMachineContext,
	DungeonMachineEvent,
} from "./types";

export const createFloorOneMachine = (options?: {
	context?: Partial<DungeonMachineContext>;
}) =>
	setup({
		types: {
			context: {} as DungeonMachineContext,
			events: {} as DungeonMachineEvent,
		},
		guards: {
			doorIsOpened: ({ context }, params: { doorKey: DoorStateKey }) =>
				isDoorOpened(context, params.doorKey),
			treasuryCanBeEntered: ({ context }) => canEnterFloorOneTreasury(context),
			exitCanBeEntered: ({ context }) => canEnterFloorOneExit(context),
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
						guard: {
							type: "doorIsOpened",
							params: { doorKey: buildDoorKey(ROOM_IDS.ENTRANCE, "south") },
						},
						actions: [
							assign(({ context }) =>
								openFloorOneDoor(
									context,
									buildDoorKey(ROOM_IDS.ENTRANCE, "south"),
								),
							),
							assign(({ context }) =>
								updateFloorOneContextRoom(context, ROOM_IDS.LIBRARY),
							),
						],
					},
					[DUNGEON_EVENTS.OPEN_DOOR]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event) {
								return openFloorOneDoor(context, event.doorKey);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.NEAR_INTERACTABLE]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event && "interactableType" in event) {
								return setFloorOneNearInteractable(
									context,
									event.doorKey,
									event.interactableType,
								);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.LEFT_INTERACTABLE]: {
						actions: assign(({ context }) =>
							clearFloorOneNearInteractable(context),
						),
					},
				},
			},
			[ROOM_IDS.LIBRARY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						guard: {
							type: "doorIsOpened",
							params: { doorKey: buildDoorKey(ROOM_IDS.LIBRARY, "south") },
						},
						actions: [
							assign(({ context }) =>
								openFloorOneDoor(
									context,
									buildDoorKey(ROOM_IDS.LIBRARY, "south"),
								),
							),
							assign(({ context }) =>
								updateFloorOneContextRoom(context, ROOM_IDS.GUARD_ROOM),
							),
						],
					},
					[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
						target: ROOM_IDS.ENTRANCE,
						guard: {
							type: "doorIsOpened",
							params: { doorKey: buildDoorKey(ROOM_IDS.LIBRARY, "north") },
						},
						actions: [
							assign(({ context }) =>
								openFloorOneDoor(
									context,
									buildDoorKey(ROOM_IDS.LIBRARY, "north"),
								),
							),
							assign(({ context }) =>
								updateFloorOneContextRoom(context, ROOM_IDS.ENTRANCE),
							),
						],
					},
					[DUNGEON_EVENTS.OPEN_DOOR]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event) {
								return openFloorOneDoor(context, event.doorKey);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.NEAR_INTERACTABLE]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event && "interactableType" in event) {
								return setFloorOneNearInteractable(
									context,
									event.doorKey,
									event.interactableType,
								);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.LEFT_INTERACTABLE]: {
						actions: assign(({ context }) =>
							clearFloorOneNearInteractable(context),
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
						guard: {
							type: "doorIsOpened",
							params: { doorKey: buildDoorKey(ROOM_IDS.GUARD_ROOM, "south") },
						},
						actions: [
							assign(({ context }) =>
								openFloorOneDoor(
									context,
									buildDoorKey(ROOM_IDS.GUARD_ROOM, "south"),
								),
							),
							assign(({ context }) =>
								updateFloorOneContextRoom(context, ROOM_IDS.TREASURY),
							),
						],
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
						guard: {
							type: "doorIsOpened",
							params: { doorKey: buildDoorKey(ROOM_IDS.GUARD_ROOM, "north") },
						},
						actions: [
							assign(({ context }) =>
								openFloorOneDoor(
									context,
									buildDoorKey(ROOM_IDS.GUARD_ROOM, "north"),
								),
							),
							assign(({ context }) =>
								updateFloorOneContextRoom(context, ROOM_IDS.LIBRARY),
							),
						],
					},
					[DUNGEON_EVENTS.OPEN_DOOR]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event) {
								return openFloorOneDoor(context, event.doorKey);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.NEAR_INTERACTABLE]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event && "interactableType" in event) {
								return setFloorOneNearInteractable(
									context,
									event.doorKey,
									event.interactableType,
								);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.LEFT_INTERACTABLE]: {
						actions: assign(({ context }) =>
							clearFloorOneNearInteractable(context),
						),
					},
				},
			},
			[ROOM_IDS.TREASURY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_EXIT]: {
						target: ROOM_IDS.EXIT,
						guard: {
							type: "doorIsOpened",
							params: { doorKey: buildDoorKey(ROOM_IDS.TREASURY, "south") },
						},
						actions: [
							assign(({ context }) =>
								openFloorOneDoor(
									context,
									buildDoorKey(ROOM_IDS.TREASURY, "south"),
								),
							),
							assign(({ context }) =>
								updateFloorOneContextRoom(context, ROOM_IDS.EXIT),
							),
						],
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
						guard: {
							type: "doorIsOpened",
							params: { doorKey: buildDoorKey(ROOM_IDS.TREASURY, "north") },
						},
						actions: [
							assign(({ context }) =>
								openFloorOneDoor(
									context,
									buildDoorKey(ROOM_IDS.TREASURY, "north"),
								),
							),
							assign(({ context }) =>
								updateFloorOneContextRoom(context, ROOM_IDS.GUARD_ROOM),
							),
						],
					},
					[DUNGEON_EVENTS.OPEN_DOOR]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event) {
								return openFloorOneDoor(context, event.doorKey);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.NEAR_INTERACTABLE]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event && "interactableType" in event) {
								return setFloorOneNearInteractable(
									context,
									event.doorKey,
									event.interactableType,
								);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.LEFT_INTERACTABLE]: {
						actions: assign(({ context }) =>
							clearFloorOneNearInteractable(context),
						),
					},
				},
			},
			[ROOM_IDS.EXIT]: {
				on: {
					[DUNGEON_EVENTS.RETURN_TO_TREASURY]: {
						target: ROOM_IDS.TREASURY,
						guard: {
							type: "doorIsOpened",
							params: { doorKey: buildDoorKey(ROOM_IDS.EXIT, "north") },
						},
						actions: [
							assign(({ context }) =>
								openFloorOneDoor(context, buildDoorKey(ROOM_IDS.EXIT, "north")),
							),
							assign(({ context }) =>
								updateFloorOneContextRoom(context, ROOM_IDS.TREASURY),
							),
						],
					},
					[DUNGEON_EVENTS.OPEN_DOOR]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event) {
								return openFloorOneDoor(context, event.doorKey);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.NEAR_INTERACTABLE]: {
						actions: assign(({ context, event }) => {
							if ("doorKey" in event && "interactableType" in event) {
								return setFloorOneNearInteractable(
									context,
									event.doorKey,
									event.interactableType,
								);
							}
							return context;
						}),
					},
					[DUNGEON_EVENTS.LEFT_INTERACTABLE]: {
						actions: assign(({ context }) =>
							clearFloorOneNearInteractable(context),
						),
					},
				},
			},
		},
	});
