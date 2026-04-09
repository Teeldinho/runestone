// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import {
	DUNGEON_EVENTS,
	FLOOR_ONE_GUARD_KEYS,
	ROOM_IDS,
	ROOM_LABELS,
} from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import {
	formatMachineStateLabel,
	getMachineGraphGuardLabel,
	getMachineGraphTransitionEventLabel,
	type MachineGraphSection,
	type PositionedMachineGraphNode,
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_NODE_KINDS,
	STATE_VISUALIZER_SECTION_IDS,
	STATE_VISUALIZER_SECTIONS,
	StateVisualizerWorkspaceProvider,
} from "@/features/state-visualizer";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_REACT_FLOW_DEFAULTS,
	INSPECTOR_REACT_FLOW_SECTION_PADDING,
} from "../config";

import { useXStateInspectorPanel } from "./useXStateInspectorPanel";

const TEST_GRAPH_POSITIONS = {
	ENTRANCE: { x: 80, y: 120 },
	GUARD_ROOM: { x: 420, y: 120 },
} as const;

const TEST_SECTION_LABELS = {
	DUNGEON:
		STATE_VISUALIZER_SECTIONS.find(
			(section) => section.id === STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		)?.label ?? STATE_VISUALIZER_SECTION_IDS.DUNGEON,
	CAMERA:
		STATE_VISUALIZER_SECTIONS.find(
			(section) => section.id === STATE_VISUALIZER_SECTION_IDS.CAMERA,
		)?.label ?? STATE_VISUALIZER_SECTION_IDS.CAMERA,
} as const;

const TEST_EDGE_ID = `${ROOM_IDS.ENTRANCE}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR}${ROOM_IDS.GUARD_ROOM}`;

const GRAPH_NODES: PositionedMachineGraphNode[] = [
	{
		id: ROOM_IDS.ENTRANCE,
		isActive: true,
		kind: STATE_VISUALIZER_NODE_KINDS.INITIAL,
		label: ROOM_LABELS[ROOM_IDS.ENTRANCE],
		position: TEST_GRAPH_POSITIONS.ENTRANCE,
	},
	{
		id: ROOM_IDS.GUARD_ROOM,
		isActive: false,
		kind: STATE_VISUALIZER_NODE_KINDS.STATE,
		label: ROOM_LABELS[ROOM_IDS.GUARD_ROOM],
		position: TEST_GRAPH_POSITIONS.GUARD_ROOM,
	},
];

const GRAPH_EDGES = [
	{
		eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
		guard: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
		id: TEST_EDGE_ID,
		source: ROOM_IDS.ENTRANCE,
		target: ROOM_IDS.GUARD_ROOM,
	},
];

const SECTIONS: MachineGraphSection[] = [
	{
		id: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		label: TEST_SECTION_LABELS.DUNGEON,
		activeStateLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
		guardKeys: [FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED],
		nodes: GRAPH_NODES,
		edges: GRAPH_EDGES,
		positionedNodes: GRAPH_NODES,
	},
	{
		id: STATE_VISUALIZER_SECTION_IDS.CAMERA,
		label: TEST_SECTION_LABELS.CAMERA,
		activeStateLabel: formatMachineStateLabel(CAMERA_MODES.FREE_ORBITAL),
		guardKeys: [],
		nodes: [],
		edges: [],
		positionedNodes: [],
	},
];

describe("useXStateInspectorPanel", () => {
	it("returns tab-synced selected section view model", () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<StateVisualizerWorkspaceProvider>
				{children}
			</StateVisualizerWorkspaceProvider>
		);

		const { result } = renderHook(
			() =>
				useXStateInspectorPanel({
					sections: SECTIONS,
				}),
			{ wrapper },
		);

		expect(result.current.sectionTabs).toEqual([
			{
				id: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
				label: TEST_SECTION_LABELS.DUNGEON,
			},
			{
				id: STATE_VISUALIZER_SECTION_IDS.CAMERA,
				label: TEST_SECTION_LABELS.CAMERA,
			},
		]);
		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);
		expect(result.current.selectedSection).not.toBeNull();
		expect(result.current.selectedSection?.flowNodes).toHaveLength(2);
		expect(result.current.selectedSection?.flowEdges).toHaveLength(1);
		expect(result.current.selectedSection?.guardIndicators).toEqual([
			expect.objectContaining({
				label: getMachineGraphGuardLabel(
					FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
				),
				color: INSPECTOR_FLOW_EDGE_LAYOUT.GUARDED_EDGE_STROKE_COLOR,
				transitionCount: 1,
			}),
		]);
		expect(result.current.selectedFlowFitViewPadding).toBe(
			INSPECTOR_REACT_FLOW_DEFAULTS.FIT_VIEW_PADDING,
		);
		expect(result.current.selectedSection?.transitionDetails[0]).toMatchObject({
			eventLabel: getMachineGraphTransitionEventLabel(
				DUNGEON_EVENTS.ENTER_GUARD_ROOM,
			),
			requirementLabel: getMachineGraphGuardLabel(
				FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
			),
			flowLabel: `${ROOM_LABELS[ROOM_IDS.ENTRANCE]}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_FLOW_SEPARATOR}${ROOM_LABELS[ROOM_IDS.GUARD_ROOM]}`,
		});

		act(() => {
			result.current.handleSelectedSectionIdChange(
				STATE_VISUALIZER_SECTION_IDS.CAMERA,
			);
		});

		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);
		expect(result.current.selectedFlowFitViewPadding).toBe(
			INSPECTOR_REACT_FLOW_SECTION_PADDING.CAMERA,
		);
	});
});
