import { describe, expect, it } from "vitest";
import { setup } from "xstate";

import { createDungeonFloorLayout } from "./dungeonGenerator";

const ROOM_IDS = {
	ENTRANCE: "entrance",
	LIBRARY: "library",
	GUARD_ROOM: "guardRoom",
	TREASURY: "treasury",
	EXIT: "exit",
} as const;

type RoomLayout = {
	roomId: string;
	position: readonly [number, number, number];
};

type CorridorLayout = {
	sourceRoomId: string;
	targetRoomId: string;
};

type TransitionLayout = {
	sourceRoomId: string;
	targetRoomId: string;
	isGuarded: boolean;
};

type DungeonFloorLayout = {
	rooms: RoomLayout[];
	corridors: CorridorLayout[];
	transitions: TransitionLayout[];
};

const createTestMachine = () =>
	setup({
		types: {
			context: {} as { currentRoomId: string },
			events: {} as { type: string },
		},
	}).createMachine({
		id: "testDungeon",
		initial: ROOM_IDS.ENTRANCE,
		context: {
			currentRoomId: ROOM_IDS.ENTRANCE,
		},
		states: {
			[ROOM_IDS.ENTRANCE]: {
				on: {
					ENTER_LIBRARY: {
						target: ROOM_IDS.LIBRARY,
					},
				},
			},
			[ROOM_IDS.LIBRARY]: {
				on: {
					ENTER_GUARD_ROOM: {
						target: ROOM_IDS.GUARD_ROOM,
					},
					RETURN_TO_ENTRANCE: {
						target: ROOM_IDS.ENTRANCE,
					},
				},
			},
			[ROOM_IDS.GUARD_ROOM]: {
				on: {
					ENTER_TREASURY: {
						target: ROOM_IDS.TREASURY,
						guard: () => true,
					},
					RETURN_TO_ENTRANCE: {
						target: ROOM_IDS.ENTRANCE,
					},
				},
			},
			[ROOM_IDS.TREASURY]: {
				on: {
					ENTER_EXIT: {
						target: ROOM_IDS.EXIT,
						guard: () => true,
					},
					RETURN_TO_GUARD_ROOM: {
						target: ROOM_IDS.GUARD_ROOM,
					},
				},
			},
			[ROOM_IDS.EXIT]: {
				on: {
					RETURN_TO_GUARD_ROOM: {
						target: ROOM_IDS.GUARD_ROOM,
					},
				},
			},
		},
	});

describe("createDungeonFloorLayout", () => {
	it("creates room positions for every floor-one machine state", () => {
		const machine = createTestMachine();
		const floorLayout = createDungeonFloorLayout(machine) as DungeonFloorLayout;

		expect(floorLayout.rooms).toHaveLength(5);
		expect(floorLayout.rooms.map((room) => room.roomId)).toEqual([
			ROOM_IDS.ENTRANCE,
			ROOM_IDS.LIBRARY,
			ROOM_IDS.GUARD_ROOM,
			ROOM_IDS.TREASURY,
			ROOM_IDS.EXIT,
		]);
		expect(
			new Set(floorLayout.rooms.map((room) => room.position.join(":"))).size,
		).toBe(5);
	});

	it("derives corridor connections from room adjacency", () => {
		const machine = createTestMachine();
		const floorLayout = createDungeonFloorLayout(machine) as DungeonFloorLayout;

		expect(
			floorLayout.corridors.map(
				(corridor) => `${corridor.sourceRoomId}:${corridor.targetRoomId}`,
			),
		).toEqual([
			`${ROOM_IDS.ENTRANCE}:${ROOM_IDS.LIBRARY}`,
			`${ROOM_IDS.LIBRARY}:${ROOM_IDS.GUARD_ROOM}`,
			`${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.TREASURY}`,
			`${ROOM_IDS.TREASURY}:${ROOM_IDS.EXIT}`,
		]);
	});

	it("marks guarded transitions from the floor machine definition", () => {
		const machine = createTestMachine();
		const floorLayout = createDungeonFloorLayout(machine) as DungeonFloorLayout;

		expect(floorLayout.transitions).toHaveLength(8);
		expect(
			floorLayout.transitions
				.filter((transition) => transition.isGuarded)
				.map(
					(transition) =>
						`${transition.sourceRoomId}:${transition.targetRoomId}`,
				),
		).toEqual([
			`${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.TREASURY}`,
			`${ROOM_IDS.TREASURY}:${ROOM_IDS.EXIT}`,
		]);
	});
});
