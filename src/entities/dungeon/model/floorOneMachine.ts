import { and, assign, setup } from "xstate";

import {
	DUNGEON_EVENTS,
	DUNGEON_MACHINE_IDS,
	FLOOR_ONE_EVENT_DOOR_TRANSITIONS,
	FLOOR_ONE_GUARD_KEYS,
	ROOM_IDS,
} from "../config";
import {
	buildDoorKey,
	clearFloorOneNearInteractable,
	createFloorOneContext,
	decrementFloorOneEnemies,
	FLOOR_ONE_GUARD_IMPLEMENTATIONS,
	markFloorOneTreasureKeyCollected,
	setFloorOneDoorwayFeedback,
	setFloorOneNearInteractable,
	transitionFloorOneContextRoom,
} from "../lib";
import type { DungeonMachineContext, DungeonMachineEvent } from "./types";

export const createFloorOneMachine = (options?: {
	context?: Partial<DungeonMachineContext>;
}) => {
	const getRequiredTransition = (eventType: DungeonMachineEvent["type"]) => {
		const transition = FLOOR_ONE_EVENT_DOOR_TRANSITIONS[eventType];

		if (!transition) {
			throw new Error(`Missing floor-one transition metadata for ${eventType}`);
		}

		return transition;
	};

	const entranceToLibrary = getRequiredTransition(DUNGEON_EVENTS.ENTER_LIBRARY);
	const libraryToGuardRoom = getRequiredTransition(
		DUNGEON_EVENTS.ENTER_GUARD_ROOM,
	);
	const libraryToEntrance = getRequiredTransition(
		DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
	);
	const guardRoomToTreasury = getRequiredTransition(
		DUNGEON_EVENTS.ENTER_TREASURY,
	);
	const guardRoomToLibrary = getRequiredTransition(
		DUNGEON_EVENTS.RETURN_TO_LIBRARY,
	);
	const treasuryToExit = getRequiredTransition(DUNGEON_EVENTS.ENTER_EXIT);
	const treasuryToGuardRoom = getRequiredTransition(
		DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM,
	);
	const exitToTreasury = getRequiredTransition(
		DUNGEON_EVENTS.RETURN_TO_TREASURY,
	);

	return setup({
		types: {
			context: {} as DungeonMachineContext,
			events: {} as DungeonMachineEvent,
		},
		guards: FLOOR_ONE_GUARD_IMPLEMENTATIONS,
	}).createMachine({
		id: DUNGEON_MACHINE_IDS.FLOOR_ONE,
		initial: ROOM_IDS.ENTRANCE,
		context: createFloorOneContext(options?.context),
		on: {
			[DUNGEON_EVENTS.NEAR_INTERACTABLE]: {
				actions: assign(({ context, event }) => {
					if ("interactableId" in event && "interactableType" in event) {
						return setFloorOneNearInteractable(
							context,
							event.interactableId,
							event.interactableType,
						);
					}

					return context;
				}),
			},
			[DUNGEON_EVENTS.LEFT_INTERACTABLE]: {
				actions: assign(({ context, event }) => {
					if (
						"interactableId" in event &&
						context.nearInteractable === event.interactableId
					) {
						return clearFloorOneNearInteractable(context);
					}

					return context;
				}),
			},
			[DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT]: {
				actions: assign(({ context }) =>
					setFloorOneDoorwayFeedback(
						context,
						DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT,
					),
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
		},
		states: {
			[ROOM_IDS.ENTRANCE]: {
				on: {
					[DUNGEON_EVENTS.ENTER_LIBRARY]: {
						target: ROOM_IDS.LIBRARY,
						guard: {
							type: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
							params: {
								interactableId: buildDoorKey(
									entranceToLibrary.fromRoom,
									entranceToLibrary.departureDoorSide,
								),
							},
						},
						actions: assign(({ context }) =>
							transitionFloorOneContextRoom(context, {
								fromRoom: entranceToLibrary.fromRoom,
								toRoom: entranceToLibrary.toRoom,
								doorSide: entranceToLibrary.arrivalDoorSide,
							}),
						),
					},
				},
			},
			[ROOM_IDS.LIBRARY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						guard: {
							type: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
							params: {
								interactableId: buildDoorKey(
									libraryToGuardRoom.fromRoom,
									libraryToGuardRoom.departureDoorSide,
								),
							},
						},
						actions: assign(({ context }) =>
							transitionFloorOneContextRoom(context, {
								fromRoom: libraryToGuardRoom.fromRoom,
								toRoom: libraryToGuardRoom.toRoom,
								doorSide: libraryToGuardRoom.arrivalDoorSide,
							}),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_ENTRANCE]: {
						target: ROOM_IDS.ENTRANCE,
						guard: {
							type: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
							params: {
								interactableId: buildDoorKey(
									libraryToEntrance.fromRoom,
									libraryToEntrance.departureDoorSide,
								),
							},
						},
						actions: assign(({ context }) =>
							transitionFloorOneContextRoom(context, {
								fromRoom: libraryToEntrance.fromRoom,
								toRoom: libraryToEntrance.toRoom,
								doorSide: libraryToEntrance.arrivalDoorSide,
							}),
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
						guard: {
							type: FLOOR_ONE_GUARD_KEYS.CAN_PICK_UP_TREASURE_KEY,
						},
						actions: assign(({ context }) =>
							markFloorOneTreasureKeyCollected(context),
						),
					},
					[DUNGEON_EVENTS.ENTER_TREASURY]: {
						target: ROOM_IDS.TREASURY,
						guard: and([
							{
								type: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
								params: {
									interactableId: buildDoorKey(
										guardRoomToTreasury.fromRoom,
										guardRoomToTreasury.departureDoorSide,
									),
								},
							},
							{ type: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED },
						]),
						actions: assign(({ context }) =>
							transitionFloorOneContextRoom(context, {
								fromRoom: guardRoomToTreasury.fromRoom,
								toRoom: guardRoomToTreasury.toRoom,
								doorSide: guardRoomToTreasury.arrivalDoorSide,
							}),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_LIBRARY]: {
						target: ROOM_IDS.LIBRARY,
						guard: {
							type: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
							params: {
								interactableId: buildDoorKey(
									guardRoomToLibrary.fromRoom,
									guardRoomToLibrary.departureDoorSide,
								),
							},
						},
						actions: assign(({ context }) =>
							transitionFloorOneContextRoom(context, {
								fromRoom: guardRoomToLibrary.fromRoom,
								toRoom: guardRoomToLibrary.toRoom,
								doorSide: guardRoomToLibrary.arrivalDoorSide,
							}),
						),
					},
				},
			},
			[ROOM_IDS.TREASURY]: {
				on: {
					[DUNGEON_EVENTS.ENTER_EXIT]: {
						target: ROOM_IDS.EXIT,
						guard: and([
							{
								type: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
								params: {
									interactableId: buildDoorKey(
										treasuryToExit.fromRoom,
										treasuryToExit.departureDoorSide,
									),
								},
							},
							{ type: FLOOR_ONE_GUARD_KEYS.EXIT_CAN_BE_ENTERED },
						]),
						actions: assign(({ context }) =>
							transitionFloorOneContextRoom(context, {
								fromRoom: treasuryToExit.fromRoom,
								toRoom: treasuryToExit.toRoom,
								doorSide: treasuryToExit.arrivalDoorSide,
							}),
						),
					},
					[DUNGEON_EVENTS.RETURN_TO_GUARD_ROOM]: {
						target: ROOM_IDS.GUARD_ROOM,
						guard: {
							type: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
							params: {
								interactableId: buildDoorKey(
									treasuryToGuardRoom.fromRoom,
									treasuryToGuardRoom.departureDoorSide,
								),
							},
						},
						actions: assign(({ context }) =>
							transitionFloorOneContextRoom(context, {
								fromRoom: treasuryToGuardRoom.fromRoom,
								toRoom: treasuryToGuardRoom.toRoom,
								doorSide: treasuryToGuardRoom.arrivalDoorSide,
							}),
						),
					},
				},
			},
			[ROOM_IDS.EXIT]: {
				on: {
					[DUNGEON_EVENTS.RETURN_TO_TREASURY]: {
						target: ROOM_IDS.TREASURY,
						guard: {
							type: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
							params: {
								interactableId: buildDoorKey(
									exitToTreasury.fromRoom,
									exitToTreasury.departureDoorSide,
								),
							},
						},
						actions: assign(({ context }) =>
							transitionFloorOneContextRoom(context, {
								fromRoom: exitToTreasury.fromRoom,
								toRoom: exitToTreasury.toRoom,
								doorSide: exitToTreasury.arrivalDoorSide,
							}),
						),
					},
				},
			},
		},
	});
};
