import { describe, expect, it } from "vitest";

import {
	DUNGEON_EVENTS,
	FLOOR_ONE_GUARD_KEYS,
	ROOM_IDS,
	ROOM_LABELS,
} from "@/entities/dungeon";
import {
	getMachineGraphGuardLabel,
	getMachineGraphTransitionEventLabel,
	type MachineGraphSection,
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_NODE_KINDS,
	STATE_VISUALIZER_SECTION_IDS,
	STATE_VISUALIZER_SECTIONS,
} from "@/features/state-visualizer";

import { INSPECTOR_ID_SEGMENT_SEPARATOR } from "../config";
import { createInspectorMachineSectionViewModel } from "./inspectorSectionViewModel";

const TEST_EDGE_ID = `${ROOM_IDS.ENTRANCE}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR}${ROOM_IDS.GUARD_ROOM}`;

const TEST_SECTION: MachineGraphSection = {
	id: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
	label:
		STATE_VISUALIZER_SECTIONS.find(
			(section) => section.id === STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		)?.label ?? STATE_VISUALIZER_SECTION_IDS.DUNGEON,
	activeStateLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
	guardKeys: [FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED],
	nodes: [],
	edges: [
		{
			eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
			guard: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
			id: TEST_EDGE_ID,
			source: ROOM_IDS.ENTRANCE,
			target: ROOM_IDS.GUARD_ROOM,
		},
	],
	positionedNodes: [
		{
			id: ROOM_IDS.ENTRANCE,
			isActive: true,
			kind: STATE_VISUALIZER_NODE_KINDS.INITIAL,
			label: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			position: { x: 80, y: 120 },
		},
		{
			id: ROOM_IDS.GUARD_ROOM,
			isActive: false,
			kind: STATE_VISUALIZER_NODE_KINDS.STATE,
			label: ROOM_LABELS[ROOM_IDS.GUARD_ROOM],
			position: { x: 420, y: 120 },
		},
	],
};

describe("createInspectorMachineSectionViewModel", () => {
	it("builds section metadata, guard indicators and transition details", () => {
		const result = createInspectorMachineSectionViewModel(TEST_SECTION);

		expect(result.id).toBe(STATE_VISUALIZER_SECTION_IDS.DUNGEON);
		expect(result.activeStateLabel).toBe(ROOM_LABELS[ROOM_IDS.ENTRANCE]);
		expect(result.guardDetails).toEqual([
			{
				id: [
					STATE_VISUALIZER_SECTION_IDS.DUNGEON,
					FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
				].join(INSPECTOR_ID_SEGMENT_SEPARATOR),
				label: getMachineGraphGuardLabel(
					FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
				),
			},
		]);
		expect(result.guardIndicators[0]).toEqual(
			expect.objectContaining({
				label: getMachineGraphGuardLabel(
					FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
				),
				transitionCount: 1,
			}),
		);
		expect(result.transitionDetails[0]).toMatchObject({
			eventLabel: getMachineGraphTransitionEventLabel(
				DUNGEON_EVENTS.ENTER_GUARD_ROOM,
			),
			requirementLabel: getMachineGraphGuardLabel(
				FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
			),
			flowLabel: `${ROOM_LABELS[ROOM_IDS.ENTRANCE]}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_FLOW_SEPARATOR}${ROOM_LABELS[ROOM_IDS.GUARD_ROOM]}`,
		});
		expect(result.flowNodes).toHaveLength(2);
		expect(result.flowEdges).toHaveLength(1);
		expect(result.hasGuardIndicators).toBe(true);
	});
});
