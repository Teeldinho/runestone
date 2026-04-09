// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import {
	type MachineGraphSection,
	type PositionedMachineGraphNode,
	StateVisualizerWorkspaceProvider,
} from "@/features/state-visualizer";

import { INSPECTOR_REACT_FLOW_SECTION_PADDING } from "../config";

import { useXStateInspectorPanel } from "./useXStateInspectorPanel";

const GRAPH_NODES: PositionedMachineGraphNode[] = [
	{
		id: ROOM_IDS.ENTRANCE,
		isActive: true,
		kind: "initial",
		label: "Entrance",
		position: { x: 80, y: 120 },
	},
	{
		id: ROOM_IDS.GUARD_ROOM,
		isActive: false,
		kind: "state",
		label: "Guard Room",
		position: { x: 420, y: 120 },
	},
];

const GRAPH_EDGES = [
	{
		eventType: "ENTER_GUARD_ROOM",
		guard: "treasuryCanBeEntered",
		id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
		source: ROOM_IDS.ENTRANCE,
		target: ROOM_IDS.GUARD_ROOM,
	},
];

const SECTIONS: MachineGraphSection[] = [
	{
		id: "dungeon",
		label: "Dungeon",
		activeStateLabel: "Entrance",
		guardKeys: ["treasuryCanBeEntered"],
		nodes: GRAPH_NODES,
		edges: GRAPH_EDGES,
		positionedNodes: GRAPH_NODES,
	},
	{
		id: "camera",
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
			{ id: "dungeon", label: "Dungeon" },
			{ id: "camera", label: "Camera" },
		]);
		expect(result.current.selectedSectionId).toBe("dungeon");
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
		expect(result.current.selectedFlowFitViewPadding).toBe(0.16);
		expect(result.current.selectedSection?.transitionDetails[0]).toMatchObject({
			eventLabel: "Enter Guard Room",
			requirementLabel:
				"The guard has been defeated and the treasure key is in hand",
			flowLabel: "Entrance -> Guard Room",
		});

		act(() => {
			result.current.handleSelectedSectionIdChange("camera");
		});

		expect(result.current.selectedSectionId).toBe("camera");
		expect(result.current.selectedFlowFitViewPadding).toBe(
			INSPECTOR_REACT_FLOW_SECTION_PADDING.CAMERA,
		);
	});
});
