import { describe, expect, it } from "vitest";
import { ROOM_IDS } from "@/entities/dungeon";
import type {
	MachineGraphEdge,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";

import {
	mapGraphEdgesToFlowEdges,
	mapGraphNodesToFlowNodes,
} from "./reactFlowGraphMappers";

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
		eventType: "ENTER_GUARD_ROOM",
		guard: "hasKey",
		id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
		source: ROOM_IDS.ENTRANCE,
		target: ROOM_IDS.GUARD_ROOM,
	},
	{
		eventType: "RETURN_TO_ENTRANCE",
		guard: null,
		id: `${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.ENTRANCE}`,
		source: ROOM_IDS.GUARD_ROOM,
		target: ROOM_IDS.ENTRANCE,
	},
];

describe("reactFlowGraphMappers", () => {
	it("maps machine graph nodes to React Flow nodes", () => {
		const flowNodes = mapGraphNodesToFlowNodes(GRAPH_NODES);

		expect(flowNodes).toHaveLength(2);
		expect(flowNodes[0]).toMatchObject({
			id: ROOM_IDS.ENTRANCE,
			position: { x: 80, y: 120 },
			data: {
				label: "Entrance",
				kind: "initial",
				isActive: true,
			},
		});
	});

	it("maps graph edges and renders guard fallback labels", () => {
		const flowEdges = mapGraphEdgesToFlowEdges(GRAPH_EDGES);

		expect(flowEdges).toHaveLength(2);
		expect(flowEdges).toContainEqual(
			expect.objectContaining({
				id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
				label: "Enter Guard Room",
			}),
		);
		expect(flowEdges).toContainEqual(
			expect.objectContaining({
				id: `${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.ENTRANCE}`,
				label: "Return to Entrance",
			}),
		);
	});
});
