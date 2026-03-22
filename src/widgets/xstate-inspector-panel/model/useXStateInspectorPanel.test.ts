// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import type {
	MachineGraphEdge,
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

const GRAPH_EDGES: MachineGraphEdge[] = [
	{
		guard: "hasTreasureKey",
		id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
		source: ROOM_IDS.ENTRANCE,
		target: ROOM_IDS.GUARD_ROOM,
	},
];

describe("useXStateInspectorPanel", () => {
	it("creates React Flow compatible graph data from machine graph props", () => {
		const { result } = renderHook(() =>
			useXStateInspectorPanel({
				activeStateLabel: "entrance",
				graphNodes: GRAPH_NODES,
				graphEdges: GRAPH_EDGES,
			}),
		);

		expect(result.current.activeStateLabel).toBe("entrance");
		expect(result.current.flowNodes).toHaveLength(2);
		expect(result.current.flowEdges).toHaveLength(1);
		expect(result.current.flowNodes[0]).toMatchObject({
			id: ROOM_IDS.ENTRANCE,
			data: {
				label: "Entrance",
				isActive: true,
			},
		});
		expect(result.current.flowEdges[0]).toMatchObject({
			id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
			label: "hasTreasureKey",
		});
	});
});
