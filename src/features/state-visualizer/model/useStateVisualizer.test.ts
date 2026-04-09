// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMachine } from "xstate";

import { DUNGEON_MACHINE_IDS, ROOM_IDS } from "@/entities/dungeon";
import { PLAYER_STATES } from "@/entities/player";

import { STATE_VISUALIZER_SECTION_IDS } from "../config";

import {
	type UseStateVisualizerInput,
	useStateVisualizer,
} from "./useStateVisualizer";

const USE_STATE_VISUALIZER_TEST_EXPECTATIONS = {
	SECTION_COUNT: 4,
	DUNGEON_NODE_COUNT: 5,
} as const;

const TEST_CAMERA_MACHINE = {
	ID: "camera",
	MODES: {
		FREE_ORBITAL: "freeOrbital",
		TOP_DOWN: "topDown",
	},
} as const;

const TEST_AUDIO_MACHINE = {
	ID: "audio",
	STATES: {
		PLAYING: "playing",
		PAUSED: "paused",
	},
} as const;

const TEST_MACHINES_BY_SECTION_ID: UseStateVisualizerInput["machinesBySectionId"] =
	{
		[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: createMachine({
			id: DUNGEON_MACHINE_IDS.FLOOR_ONE,
			initial: ROOM_IDS.ENTRANCE,
			states: {
				[ROOM_IDS.ENTRANCE]: {
					on: {
						ENTER_LIBRARY: ROOM_IDS.LIBRARY,
						ENTER_GUARD_ROOM: ROOM_IDS.GUARD_ROOM,
					},
				},
				[ROOM_IDS.LIBRARY]: {
					on: {
						ENTER_GUARD_ROOM: ROOM_IDS.GUARD_ROOM,
					},
				},
				[ROOM_IDS.GUARD_ROOM]: {
					on: {
						ENTER_TREASURY: ROOM_IDS.TREASURY,
					},
				},
				[ROOM_IDS.TREASURY]: {
					on: {
						ENTER_EXIT: ROOM_IDS.EXIT,
					},
				},
				[ROOM_IDS.EXIT]: {},
			},
		}),
		[STATE_VISUALIZER_SECTION_IDS.CAMERA]: createMachine({
			id: TEST_CAMERA_MACHINE.ID,
			initial: TEST_CAMERA_MACHINE.MODES.FREE_ORBITAL,
			states: {
				[TEST_CAMERA_MACHINE.MODES.FREE_ORBITAL]: {
					on: {
						SET_TOP_DOWN: TEST_CAMERA_MACHINE.MODES.TOP_DOWN,
					},
				},
				[TEST_CAMERA_MACHINE.MODES.TOP_DOWN]: {},
			},
		}),
		[STATE_VISUALIZER_SECTION_IDS.AUDIO]: createMachine({
			id: TEST_AUDIO_MACHINE.ID,
			initial: TEST_AUDIO_MACHINE.STATES.PLAYING,
			states: {
				[TEST_AUDIO_MACHINE.STATES.PLAYING]: {
					on: {
						PAUSE: TEST_AUDIO_MACHINE.STATES.PAUSED,
					},
				},
				[TEST_AUDIO_MACHINE.STATES.PAUSED]: {},
			},
		}),
		[STATE_VISUALIZER_SECTION_IDS.PLAYER]: createMachine({
			id: STATE_VISUALIZER_SECTION_IDS.PLAYER,
			type: "parallel",
			states: {
				[PLAYER_STATES.REGIONS.HEALTH]: {
					initial: PLAYER_STATES.HEALTH.ALIVE,
					states: {
						[PLAYER_STATES.HEALTH.ALIVE]: {},
						[PLAYER_STATES.HEALTH.DAMAGED]: {},
					},
				},
				[PLAYER_STATES.REGIONS.MOVEMENT]: {
					initial: PLAYER_STATES.MOVEMENT.IDLE,
					states: {
						[PLAYER_STATES.MOVEMENT.IDLE]: {},
						[PLAYER_STATES.MOVEMENT.WALKING]: {},
					},
				},
			},
		}),
	};

describe("useStateVisualizer", () => {
	it("returns machine sections with positioned graph data", () => {
		const { result } = renderHook(() =>
			useStateVisualizer({
				machinesBySectionId: TEST_MACHINES_BY_SECTION_ID,
				stateValuesBySectionId: {
					[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: ROOM_IDS.ENTRANCE,
					[STATE_VISUALIZER_SECTION_IDS.CAMERA]:
						TEST_CAMERA_MACHINE.MODES.FREE_ORBITAL,
					[STATE_VISUALIZER_SECTION_IDS.AUDIO]:
						TEST_AUDIO_MACHINE.STATES.PLAYING,
					[STATE_VISUALIZER_SECTION_IDS.PLAYER]: {
						[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.ALIVE,
						[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
					},
				},
			}),
		);

		expect(result.current.sections).toHaveLength(
			USE_STATE_VISUALIZER_TEST_EXPECTATIONS.SECTION_COUNT,
		);

		const dungeonSection = result.current.sections.find(
			(section) => section.id === STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);

		expect(dungeonSection).toBeDefined();
		expect(dungeonSection?.positionedNodes).toHaveLength(
			USE_STATE_VISUALIZER_TEST_EXPECTATIONS.DUNGEON_NODE_COUNT,
		);
		expect(dungeonSection?.edges.length).toBeGreaterThan(0);

		const entranceNode = dungeonSection?.positionedNodes.find((node) =>
			node.id.endsWith(`.${ROOM_IDS.ENTRANCE}`),
		);

		expect(entranceNode?.isActive).toBe(true);
		expect(entranceNode?.position.x).toEqual(expect.any(Number));
		expect(entranceNode?.position.y).toEqual(expect.any(Number));

		const libraryNode = dungeonSection?.positionedNodes.find((node) =>
			node.id.endsWith(`.${ROOM_IDS.LIBRARY}`),
		);

		expect(libraryNode?.position.y).toBeGreaterThan(
			entranceNode?.position.y ?? 0,
		);
	});

	it("updates section active metadata when machine state values change", () => {
		const { result, rerender } = renderHook(
			({
				dungeonStateValue,
			}: {
				dungeonStateValue: (typeof ROOM_IDS)[keyof typeof ROOM_IDS];
			}) =>
				useStateVisualizer({
					machinesBySectionId: TEST_MACHINES_BY_SECTION_ID,
					stateValuesBySectionId: {
						[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: dungeonStateValue,
						[STATE_VISUALIZER_SECTION_IDS.CAMERA]:
							TEST_CAMERA_MACHINE.MODES.TOP_DOWN,
						[STATE_VISUALIZER_SECTION_IDS.AUDIO]:
							TEST_AUDIO_MACHINE.STATES.PAUSED,
						[STATE_VISUALIZER_SECTION_IDS.PLAYER]: {
							[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.DAMAGED,
							[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.WALKING,
						},
					},
				}),
			{
				initialProps: {
					dungeonStateValue: ROOM_IDS.ENTRANCE,
				} as {
					dungeonStateValue: (typeof ROOM_IDS)[keyof typeof ROOM_IDS];
				},
			},
		);

		rerender({
			dungeonStateValue: ROOM_IDS.GUARD_ROOM,
		});

		const dungeonSection = result.current.sections.find(
			(section) => section.id === STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);
		const activeNode = dungeonSection?.positionedNodes.find(
			(node) => node.isActive,
		);

		expect(activeNode?.id.endsWith(`.${ROOM_IDS.GUARD_ROOM}`)).toBe(true);
	});
});
