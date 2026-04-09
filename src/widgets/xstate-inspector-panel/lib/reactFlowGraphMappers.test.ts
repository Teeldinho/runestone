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
				pathOptions: { offset: 18 },
				type: "guard-marker",
				data: expect.objectContaining({
					markerLaneOffset: -18,
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
					strokeDasharray: "5 4",
					strokeOpacity: 0.55,
				},
			}),
		);
		expect(returnToEntranceEdge).toEqual(
			expect.objectContaining({
				label: "",
				pathOptions: { offset: 18 },
				data: expect.objectContaining({
					markerLaneOffset: 18,
					guardMarkers: [],
				}),
				style: {
					stroke: "var(--panel-border)",
					strokeOpacity: 0.32,
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
