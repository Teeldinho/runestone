// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { FLOOR_ONE_GUARD_KEYS, ROOM_IDS } from "@/entities/dungeon";
import {
	type MachineGraphSection,
	type PositionedMachineGraphNode,
	STATE_VISUALIZER_SECTION_IDS,
	StateVisualizerWorkspaceProvider,
} from "@/features/state-visualizer";

import {
	INSPECTOR_REACT_FLOW_DEFAULTS,
	INSPECTOR_REACT_FLOW_SECTION_PADDING,
} from "../config";

import { useXStateInspectorPanel } from "./useXStateInspectorPanel";

const TEST_GRAPH_POSITIONS = {
	ENTRANCE: { x: 80, y: 120 },
	GUARD_ROOM: { x: 420, y: 120 },
} as const;

const GRAPH_NODES: PositionedMachineGraphNode[] = [
	{
		id: ROOM_IDS.ENTRANCE,
		isActive: true,
		kind: "initial",
		label: "Entrance",
		position: TEST_GRAPH_POSITIONS.ENTRANCE,
	},
	{
		id: ROOM_IDS.GUARD_ROOM,
		isActive: false,
		kind: "state",
		label: "Guard Room",
		position: TEST_GRAPH_POSITIONS.GUARD_ROOM,
	},
];

const GRAPH_EDGES = [
	{
		eventType: "ENTER_GUARD_ROOM",
		guard: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
		id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
		source: ROOM_IDS.ENTRANCE,
		target: ROOM_IDS.GUARD_ROOM,
	},
];

const SECTIONS: MachineGraphSection[] = [
	{
		id: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		label: "Dungeon",
		activeStateLabel: "Entrance",
		guardKeys: [FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED],
		nodes: GRAPH_NODES,
		edges: GRAPH_EDGES,
		positionedNodes: GRAPH_NODES,
	},
	{
		id: STATE_VISUALIZER_SECTION_IDS.CAMERA,
		label: "Camera",
		activeStateLabel: "Free Orbital",
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
			{ id: STATE_VISUALIZER_SECTION_IDS.DUNGEON, label: "Dungeon" },
			{ id: STATE_VISUALIZER_SECTION_IDS.CAMERA, label: "Camera" },
		]);
		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);
		expect(result.current.selectedSection).not.toBeNull();
		expect(result.current.selectedSection?.flowNodes).toHaveLength(2);
		expect(result.current.selectedSection?.flowEdges).toHaveLength(1);
		expect(result.current.selectedSection?.guardIndicators).toEqual([
			expect.objectContaining({
				label: "The guard has been defeated and the treasure key is in hand",
				color: "var(--dungeon-gold)",
				transitionCount: 1,
			}),
		]);
		expect(result.current.selectedFlowFitViewPadding).toBe(
			INSPECTOR_REACT_FLOW_DEFAULTS.FIT_VIEW_PADDING,
		);
		expect(result.current.selectedSection?.transitionDetails[0]).toMatchObject({
			eventLabel: "Enter Guard Room",
			requirementLabel:
				"The guard has been defeated and the treasure key is in hand",
			flowLabel: "Entrance -> Guard Room",
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
