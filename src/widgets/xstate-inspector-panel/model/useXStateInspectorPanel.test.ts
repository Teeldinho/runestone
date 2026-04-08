// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import type {
	MachineGraphSection,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";

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
		guard: "hasKey",
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
		guardKeys: ["hasKey"],
		nodes: GRAPH_NODES,
		edges: GRAPH_EDGES,
		positionedNodes: GRAPH_NODES,
	},
];

describe("useXStateInspectorPanel", () => {
	it("creates React Flow compatible graph data from machine graph props", () => {
		const { result } = renderHook(() =>
			useXStateInspectorPanel({
				activeStateLabel: "entrance",
				sections: SECTIONS,
			}),
		);

		expect(result.current.activeStateLabel).toBe("entrance");
		expect(result.current.sections).toHaveLength(1);
		expect(result.current.sections[0].flowNodes).toHaveLength(2);
		expect(result.current.sections[0].flowEdges).toHaveLength(1);
		expect(result.current.sections[0].flowNodes[0]).toMatchObject({
			id: ROOM_IDS.ENTRANCE,
			data: {
				label: "Entrance",
				isActive: true,
			},
		});
		expect(result.current.sections[0].flowEdges[0]).toMatchObject({
			id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
			label: "ENTER_GUARD_ROOM [hasKey]",
		});
	});
});
