import { describe, expect, it } from "vitest";
import { ROOM_IDS } from "@/entities/dungeon";
import type {
	MachineGraphEdge,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";

import { INSPECTOR_FLOW_EDGE_LAYOUT } from "../config";

import {
	mapGraphEdgesToFlowEdges,
	mapGraphNodesToFlowNodes,
} from "./reactFlowGraphMappers";

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
			position: TEST_GRAPH_POSITIONS.ENTRANCE,
			data: {
				label: "Entrance",
				kind: "initial",
				isActive: true,
			},
		});
	});

	it("maps graph edges with lane offsets and subtle styles", () => {
		const flowEdges = mapGraphEdgesToFlowEdges(GRAPH_EDGES);
		const enterGuardRoomEdge = flowEdges.find(
			(edge) => edge.id === `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
		);
		const returnToEntranceEdge = flowEdges.find(
			(edge) => edge.id === `${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.ENTRANCE}`,
		);

		expect(flowEdges).toHaveLength(2);
		expect(enterGuardRoomEdge).toEqual(
			expect.objectContaining({
				label: "",
				pathOptions: {
					offset: INSPECTOR_FLOW_EDGE_LAYOUT.LANE_OFFSET_STEP,
				},
				type: "guard-marker",
				data: expect.objectContaining({
					markerLaneOffset: -INSPECTOR_FLOW_EDGE_LAYOUT.LANE_OFFSET_STEP,
					guardMarkers: [
						expect.objectContaining({
							guardKey: "hasKey",
							guardLabel: "Has Key",
							color: "var(--dungeon-gold)",
							showDirectionIndicator: false,
						}),
					],
				}),
				style: {
					stroke: "var(--dungeon-gold)",
					strokeDasharray:
						INSPECTOR_FLOW_EDGE_LAYOUT.GUARDED_EDGE_STROKE_DASHARRAY,
					strokeOpacity: INSPECTOR_FLOW_EDGE_LAYOUT.GUARDED_EDGE_STROKE_OPACITY,
				},
			}),
		);
		expect(returnToEntranceEdge).toEqual(
			expect.objectContaining({
				label: "",
				pathOptions: {
					offset: INSPECTOR_FLOW_EDGE_LAYOUT.LANE_OFFSET_STEP,
				},
				data: expect.objectContaining({
					markerLaneOffset: INSPECTOR_FLOW_EDGE_LAYOUT.LANE_OFFSET_STEP,
					guardMarkers: [],
				}),
				style: {
					stroke: "var(--panel-border)",
					strokeOpacity:
						INSPECTOR_FLOW_EDGE_LAYOUT.UNGUARDED_EDGE_STROKE_OPACITY,
				},
			}),
		);
		expect(enterGuardRoomEdge?.animated).toBe(false);
		expect(returnToEntranceEdge?.animated).toBe(false);
	});

	it("flags direction indicators for shared guards on reverse edges", () => {
		const flowEdges = mapGraphEdgesToFlowEdges([
			{
				eventType: "ENTER_LIBRARY",
				guard: "isNearInteractable",
				id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.GUARD_ROOM}`,
				source: ROOM_IDS.ENTRANCE,
				target: ROOM_IDS.GUARD_ROOM,
			},
			{
				eventType: "RETURN_TO_ENTRANCE",
				guard: "isNearInteractable",
				id: `${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.ENTRANCE}`,
				source: ROOM_IDS.GUARD_ROOM,
				target: ROOM_IDS.ENTRANCE,
			},
		]);

		expect(flowEdges[0]?.data?.guardMarkers[0]?.showDirectionIndicator).toBe(
			true,
		);
		expect(flowEdges[1]?.data?.guardMarkers[0]?.showDirectionIndicator).toBe(
			true,
		);
	});

	it("keeps same guard color stable and different guards distinct", () => {
		const flowEdges = mapGraphEdgesToFlowEdges([
			{
				eventType: "ENTER_GUARD_ROOM",
				guard: "isNearInteractable",
				id: "entrance:guard-room",
				source: ROOM_IDS.ENTRANCE,
				target: ROOM_IDS.GUARD_ROOM,
			},
			{
				eventType: "RETURN_TO_ENTRANCE",
				guard: "isNearInteractable",
				id: "guard-room:entrance",
				source: ROOM_IDS.GUARD_ROOM,
				target: ROOM_IDS.ENTRANCE,
			},
			{
				eventType: "ENTER_TREASURY",
				guard: "treasuryCanBeEntered",
				id: "guard-room:treasury",
				source: ROOM_IDS.GUARD_ROOM,
				target: "treasury",
			},
		]);

		const sameGuardColor = flowEdges[0]?.data?.guardMarkers[0]?.color;
		expect(flowEdges[1]?.data?.guardMarkers[0]?.color).toBe(sameGuardColor);
		expect(flowEdges[2]?.data?.guardMarkers[0]?.color).not.toBe(sameGuardColor);
	});
});
