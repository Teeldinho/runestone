import { describe, expect, it } from "vitest";
import { createMachine } from "xstate";

import {
	DUNGEON_EVENTS,
	DUNGEON_MACHINE_IDS,
	ROOM_IDS,
} from "@/entities/dungeon";
import { PLAYER_STATES } from "@/entities/player";
import { CAMERA_MODES } from "@/shared/config";

import {
	STATE_VISUALIZER_DETAILS_COPY,
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_SECTION_IDS,
} from "../config";
import type { StateVisualizerSectionId } from "../model";
import {
	collectStatePaths,
	createActiveStateNodeIds,
	createStateVisualizerSections,
	formatActiveStateLabel,
} from "./stateVisualizerSections";

const TEST_CAMERA_MACHINE = {
	ID: STATE_VISUALIZER_SECTION_IDS.CAMERA,
	EVENTS: {
		SWITCH_TO_TOP_DOWN: "SWITCH_TO_TOP_DOWN",
	},
	MODES: {
		FREE_ORBITAL: CAMERA_MODES.FREE_ORBITAL,
		TOP_DOWN: CAMERA_MODES.TOP_DOWN,
	},
} as const;

const TEST_AUDIO_MACHINE = {
	ID: STATE_VISUALIZER_SECTION_IDS.AUDIO,
	EVENTS: {
		PAUSE_REQUESTED: "PAUSE_REQUESTED",
	},
	STATES: {
		PLAYING: "playing",
		PAUSED: "paused",
	},
} as const;

const TEST_MACHINES_BY_SECTION_ID: Record<
	StateVisualizerSectionId,
	ReturnType<typeof createMachine>
> = {
	[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: createMachine({
		id: DUNGEON_MACHINE_IDS.FLOOR_ONE,
		initial: ROOM_IDS.ENTRANCE,
		states: {
			[ROOM_IDS.ENTRANCE]: {
				on: {
					[DUNGEON_EVENTS.ENTER_LIBRARY]: ROOM_IDS.LIBRARY,
				},
			},
			[ROOM_IDS.LIBRARY]: {},
		},
	}),
	[STATE_VISUALIZER_SECTION_IDS.CAMERA]: createMachine({
		id: TEST_CAMERA_MACHINE.ID,
		initial: TEST_CAMERA_MACHINE.MODES.FREE_ORBITAL,
		states: {
			[TEST_CAMERA_MACHINE.MODES.FREE_ORBITAL]: {
				on: {
					[TEST_CAMERA_MACHINE.EVENTS.SWITCH_TO_TOP_DOWN]:
						TEST_CAMERA_MACHINE.MODES.TOP_DOWN,
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
					[TEST_AUDIO_MACHINE.EVENTS.PAUSE_REQUESTED]:
						TEST_AUDIO_MACHINE.STATES.PAUSED,
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
				},
			},
			[PLAYER_STATES.REGIONS.MOVEMENT]: {
				initial: PLAYER_STATES.MOVEMENT.IDLE,
				states: {
					[PLAYER_STATES.MOVEMENT.IDLE]: {},
				},
			},
		},
	}),
};

describe("stateVisualizerSections", () => {
	it("collects nested machine state paths", () => {
		expect(
			collectStatePaths({
				health: "alive",
				movement: "walking",
			}),
		).toEqual(["health.alive", "movement.walking"]);
		expect(collectStatePaths("idle")).toEqual(["idle"]);
		expect(collectStatePaths(null)).toEqual([]);
	});

	it("creates active state node ids using machine id prefix", () => {
		const machine =
			TEST_MACHINES_BY_SECTION_ID[STATE_VISUALIZER_SECTION_IDS.PLAYER];
		const activeNodeIds = createActiveStateNodeIds(machine, {
			health: PLAYER_STATES.HEALTH.ALIVE,
			movement: PLAYER_STATES.MOVEMENT.IDLE,
		});

		expect(activeNodeIds.has(`${machine.id}.health.alive`)).toBe(true);
		expect(activeNodeIds.has(`${machine.id}.movement.idle`)).toBe(true);
	});

	it("formats active state labels with fallback", () => {
		expect(formatActiveStateLabel(null)).toBe(
			STATE_VISUALIZER_DETAILS_COPY.UNKNOWN_STATE_LABEL,
		);
		expect(formatActiveStateLabel("top_down")).toBe("Top Down");
		expect(
			formatActiveStateLabel({
				health: "alive",
				movement: "idle",
			}),
		).toBe(
			`Health Alive${STATE_VISUALIZER_GRAPH_SYNTAX.STATE_PATH_DELIMITER}Movement Idle`,
		);
	});

	it("creates section nodes using responsive graph direction", () => {
		const stateValuesBySectionId = {
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: ROOM_IDS.ENTRANCE,
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]:
				TEST_CAMERA_MACHINE.MODES.FREE_ORBITAL,
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: TEST_AUDIO_MACHINE.STATES.PLAYING,
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: {
				[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.ALIVE,
				[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
			},
		} satisfies Record<StateVisualizerSectionId, unknown>;

		const desktopSections = createStateVisualizerSections({
			machinesBySectionId: TEST_MACHINES_BY_SECTION_ID,
			stateValuesBySectionId,
			isDesktopLayout: true,
		});
		const mobileSections = createStateVisualizerSections({
			machinesBySectionId: TEST_MACHINES_BY_SECTION_ID,
			stateValuesBySectionId,
			isDesktopLayout: false,
		});

		const desktopDungeonSection = desktopSections.find(
			(section) => section.id === STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);
		const mobileDungeonSection = mobileSections.find(
			(section) => section.id === STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);
		const desktopEntranceNode = desktopDungeonSection?.positionedNodes.find(
			(node) => node.id.endsWith(`.${ROOM_IDS.ENTRANCE}`),
		);
		const desktopLibraryNode = desktopDungeonSection?.positionedNodes.find(
			(node) => node.id.endsWith(`.${ROOM_IDS.LIBRARY}`),
		);
		const mobileEntranceNode = mobileDungeonSection?.positionedNodes.find(
			(node) => node.id.endsWith(`.${ROOM_IDS.ENTRANCE}`),
		);
		const mobileLibraryNode = mobileDungeonSection?.positionedNodes.find(
			(node) => node.id.endsWith(`.${ROOM_IDS.LIBRARY}`),
		);

		expect(desktopLibraryNode?.position.y).toBeGreaterThan(
			desktopEntranceNode?.position.y ?? 0,
		);
		expect(mobileLibraryNode?.position.x).toBeGreaterThan(
			mobileEntranceNode?.position.x ?? 0,
		);
	});
});
