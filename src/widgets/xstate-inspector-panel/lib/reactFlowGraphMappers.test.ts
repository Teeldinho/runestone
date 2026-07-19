import { describe, expect, it } from "vitest";
import {
	DUNGEON_EVENTS,
	FLOOR_ONE_GUARD_KEYS,
	ROOM_IDS,
	ROOM_LABELS,
} from "@/entities/dungeon";
import type {
	MachineGraphEdge,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";
import {
	getMachineGraphGuardLabel,
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_NODE_KINDS,
} from "@/features/state-visualizer";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_FLOW_EDGE_VISUALS,
	INSPECTOR_GUARD_MARKER_INTERACTION,
} from "../config";

import { createGuardMarkerEdgeLayoutViewModel } from "./guardMarkerEdgeLayoutViewModel";
import {
	mapGraphEdgesToFlowEdges,
	mapGraphNodesToFlowNodes,
} from "./reactFlowGraphMappers";

const TEST_GRAPH_POSITIONS = {
	ENTRANCE: { x: 80, y: 120 },
	GUARD_ROOM: { x: 420, y: 120 },
} as const;

const TEST_GRAPH_EDGE_IDS = {
	ENTRANCE_TO_GUARD_ROOM: `${ROOM_IDS.ENTRANCE}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR}${ROOM_IDS.GUARD_ROOM}`,
	GUARD_ROOM_TO_ENTRANCE: `${ROOM_IDS.GUARD_ROOM}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR}${ROOM_IDS.ENTRANCE}`,
	GUARD_ROOM_TO_TREASURY: `${ROOM_IDS.GUARD_ROOM}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR}${ROOM_IDS.TREASURY}`,
} as const;

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

const GRAPH_EDGES: MachineGraphEdge[] = [
	{
		eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
		guard: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
		id: TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM,
		source: ROOM_IDS.ENTRANCE,
		target: ROOM_IDS.GUARD_ROOM,
	},
	{
		eventType: DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
		guard: null,
		id: TEST_GRAPH_EDGE_IDS.GUARD_ROOM_TO_ENTRANCE,
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
				label: ROOM_LABELS[ROOM_IDS.ENTRANCE],
				kind: STATE_VISUALIZER_NODE_KINDS.INITIAL,
				isActive: true,
			},
		});
	});

	it("maps graph edges with lane offsets and subtle styles", () => {
		const flowEdges = mapGraphEdgesToFlowEdges(GRAPH_EDGES);
		const enterGuardRoomEdge = flowEdges.find(
			(edge) => edge.id === TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM,
		);
		const returnToEntranceEdge = flowEdges.find(
			(edge) => edge.id === TEST_GRAPH_EDGE_IDS.GUARD_ROOM_TO_ENTRANCE,
		);

		expect(flowEdges).toHaveLength(2);
		expect(enterGuardRoomEdge).toEqual(
			expect.objectContaining({
				label: "",
				pathOptions: {
					offset: INSPECTOR_FLOW_EDGE_LAYOUT.LANE_OFFSET_STEP,
				},
				type: INSPECTOR_FLOW_EDGE_VISUALS.TYPE,
				data: expect.objectContaining({
					markerLaneOffset: -INSPECTOR_FLOW_EDGE_LAYOUT.LANE_OFFSET_STEP,
					guardMarkers: [
						expect.objectContaining({
							guardKey: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
							guardLabel: getMachineGraphGuardLabel(
								FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
							),
							color: INSPECTOR_FLOW_EDGE_LAYOUT.GUARDED_EDGE_STROKE_COLOR,
							directionIndicatorMode:
								INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE
									.SINGLE,
						}),
					],
				}),
				style: {
					stroke: INSPECTOR_FLOW_EDGE_LAYOUT.GUARDED_EDGE_STROKE_COLOR,
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
					stroke: INSPECTOR_FLOW_EDGE_LAYOUT.UNGUARDED_EDGE_STROKE_COLOR,
					strokeOpacity:
						INSPECTOR_FLOW_EDGE_LAYOUT.UNGUARDED_EDGE_STROKE_OPACITY,
				},
			}),
		);
		expect(enterGuardRoomEdge?.animated).toBe(false);
		expect(returnToEntranceEdge?.animated).toBe(false);
	});

	it("collapses shared reverse guard markers into one dual-direction marker", () => {
		const flowEdges = mapGraphEdgesToFlowEdges([
			{
				eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
				guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
				id: TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM,
				source: ROOM_IDS.ENTRANCE,
				target: ROOM_IDS.GUARD_ROOM,
			},
			{
				eventType: DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
				guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
				id: TEST_GRAPH_EDGE_IDS.GUARD_ROOM_TO_ENTRANCE,
				source: ROOM_IDS.GUARD_ROOM,
				target: ROOM_IDS.ENTRANCE,
			},
		]);

		expect(flowEdges[0]?.data?.guardMarkers[0]?.directionIndicatorMode).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.DUAL,
		);
		expect(flowEdges[1]?.data?.guardMarkers).toHaveLength(0);
	});

	it("does not render direction arrows for self-loop guards", () => {
		const selfLoopEdgeId = `${ROOM_IDS.GUARD_ROOM}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR}${ROOM_IDS.GUARD_ROOM}`;
		const flowEdges = mapGraphEdgesToFlowEdges([
			{
				eventType: DUNGEON_EVENTS.PICK_UP_KEY,
				guard: FLOOR_ONE_GUARD_KEYS.CAN_PICK_UP_TREASURE_KEY,
				id: selfLoopEdgeId,
				source: ROOM_IDS.GUARD_ROOM,
				target: ROOM_IDS.GUARD_ROOM,
			},
		]);

		expect(flowEdges[0]?.data?.guardMarkers[0]?.directionIndicatorMode).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
		);
	});

	it("keeps same guard color stable and different guards distinct", () => {
		const flowEdges = mapGraphEdgesToFlowEdges([
			{
				eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
				guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
				id: TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM,
				source: ROOM_IDS.ENTRANCE,
				target: ROOM_IDS.GUARD_ROOM,
			},
			{
				eventType: DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
				guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
				id: TEST_GRAPH_EDGE_IDS.GUARD_ROOM_TO_ENTRANCE,
				source: ROOM_IDS.GUARD_ROOM,
				target: ROOM_IDS.ENTRANCE,
			},
			{
				eventType: DUNGEON_EVENTS.ENTER_TREASURY,
				guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
				id: TEST_GRAPH_EDGE_IDS.GUARD_ROOM_TO_TREASURY,
				source: ROOM_IDS.GUARD_ROOM,
				target: ROOM_IDS.TREASURY,
			},
			{
				eventType: DUNGEON_EVENTS.ENTER_EXIT,
				guard: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
				id: `${ROOM_IDS.TREASURY}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR}${ROOM_IDS.EXIT}`,
				source: ROOM_IDS.TREASURY,
				target: ROOM_IDS.EXIT,
			},
		]);

		const isNearInteractableColor = flowEdges[0]?.data?.guardMarkers[0]?.color;
		expect(flowEdges[2]?.data?.guardMarkers[0]?.color).toBe(
			isNearInteractableColor,
		);
		expect(flowEdges[3]?.data?.guardMarkers[0]?.color).not.toBe(
			isNearInteractableColor,
		);
	});

	it("includes authoritative source and nearby node positions for marker placement", () => {
		const positionedNodes: PositionedMachineGraphNode[] = [
			{
				id: ROOM_IDS.ENTRANCE,
				isActive: true,
				kind: STATE_VISUALIZER_NODE_KINDS.STATE,
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
			{
				id: ROOM_IDS.TREASURY,
				isActive: false,
				kind: STATE_VISUALIZER_NODE_KINDS.STATE,
				label: ROOM_LABELS[ROOM_IDS.TREASURY],
				position: { x: 260, y: 280 },
			},
		];

		const flowEdges = mapGraphEdgesToFlowEdges(
			[
				{
					eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
					guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
					id: TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM,
					source: ROOM_IDS.ENTRANCE,
					target: ROOM_IDS.GUARD_ROOM,
				},
			],
			positionedNodes,
		);

		expect(flowEdges[0]?.data?.sourceNodePosition).toEqual({ x: 80, y: 120 });
		expect(flowEdges[0]?.data?.targetNodePosition).toEqual({ x: 420, y: 120 });
		expect(flowEdges[0]?.data?.nearbyNodePositions).toEqual([
			{ x: 260, y: 280 },
		]);
	});

	it("assigns collision group slots for markers in the same lane bucket", () => {
		const collisionNodes: PositionedMachineGraphNode[] = [
			{
				id: ROOM_IDS.ENTRANCE,
				isActive: true,
				kind: STATE_VISUALIZER_NODE_KINDS.STATE,
				label: ROOM_LABELS[ROOM_IDS.ENTRANCE],
				position: { x: 100, y: 100 },
			},
			{
				id: ROOM_IDS.GUARD_ROOM,
				isActive: false,
				kind: STATE_VISUALIZER_NODE_KINDS.STATE,
				label: ROOM_LABELS[ROOM_IDS.GUARD_ROOM],
				position: { x: 100, y: 300 },
			},
		];
		const flowEdges = mapGraphEdgesToFlowEdges(
			[
				{
					eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
					guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
					id: `${TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM}:collisionA`,
					source: ROOM_IDS.ENTRANCE,
					target: ROOM_IDS.GUARD_ROOM,
				},
				{
					eventType: DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
					guard: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
					id: `${TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM}:collisionB`,
					source: ROOM_IDS.ENTRANCE,
					target: ROOM_IDS.GUARD_ROOM,
				},
			],
			collisionNodes,
		);
		const collisionMarkers = flowEdges.flatMap((flowEdge) =>
			(flowEdge.data?.guardMarkers ?? []).map((marker) => ({
				id: marker.id,
				collisionOrder: marker.collisionOrder,
				collisionGroupSize: marker.collisionGroupSize,
			})),
		);

		expect(collisionMarkers).toHaveLength(2);
		expect(collisionMarkers[0]?.collisionGroupSize).toBe(2);
		expect(collisionMarkers[1]?.collisionGroupSize).toBe(2);
		expect(
			new Set(collisionMarkers.map((marker) => marker.collisionOrder)),
		).toEqual(new Set([0, 1]));
	});

	it("keeps compound marker collision slots aligned with render order", () => {
		const compoundGuardKeys = [
			FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
			FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
			FLOOR_ONE_GUARD_KEYS.CAN_PICK_UP_TREASURE_KEY,
		];
		const [flowEdge] = mapGraphEdgesToFlowEdges(
			[
				{
					eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
					guard: compoundGuardKeys.join(
						STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_DELIMITER,
					),
					id: TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM,
					source: ROOM_IDS.ENTRANCE,
					target: ROOM_IDS.GUARD_ROOM,
				},
			],
			GRAPH_NODES,
		);
		const guardMarkers = flowEdge?.data?.guardMarkers ?? [];
		const markerTopPositions = guardMarkers.map((guardMarker, markerIndex) => {
			const layout = createGuardMarkerEdgeLayoutViewModel({
				labelX: 250,
				labelY: 200,
				markerColor: guardMarker.color,
				markerCount: guardMarkers.length,
				markerIndex,
				markerLaneOffset: 0,
				directionIndicatorMode: guardMarker.directionIndicatorMode,
				sourceX: 100,
				sourceY: 200,
				targetX: 400,
				targetY: 200,
				collisionOrder: guardMarker.collisionOrder,
				collisionGroupSize: guardMarker.collisionGroupSize,
				isDesktopLayout: true,
				isLandscape: true,
			});

			return Number(layout.markerButtonStyles.top);
		});

		expect(guardMarkers.map((marker) => marker.guardKey)).toEqual(
			compoundGuardKeys,
		);
		expect(guardMarkers.map((marker) => marker.collisionOrder)).toEqual([
			0, 1, 2,
		]);
		for (const [markerIndex, markerTop] of markerTopPositions.entries()) {
			for (const nextMarkerTop of markerTopPositions.slice(markerIndex + 1)) {
				expect(Math.abs(markerTop - nextMarkerTop)).toBeGreaterThanOrEqual(
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_HIT_AREA_PX,
				);
			}
		}
	});

	it("keeps reverse lanes in the same collision bucket", () => {
		const collisionNodes: PositionedMachineGraphNode[] = [
			{
				id: ROOM_IDS.ENTRANCE,
				isActive: true,
				kind: STATE_VISUALIZER_NODE_KINDS.STATE,
				label: ROOM_LABELS[ROOM_IDS.ENTRANCE],
				position: { x: 120, y: 100 },
			},
			{
				id: ROOM_IDS.GUARD_ROOM,
				isActive: false,
				kind: STATE_VISUALIZER_NODE_KINDS.STATE,
				label: ROOM_LABELS[ROOM_IDS.GUARD_ROOM],
				position: { x: 120, y: 300 },
			},
		];
		const flowEdges = mapGraphEdgesToFlowEdges(
			[
				{
					eventType: DUNGEON_EVENTS.ENTER_GUARD_ROOM,
					guard: FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE,
					id: `${TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM}:forward`,
					source: ROOM_IDS.ENTRANCE,
					target: ROOM_IDS.GUARD_ROOM,
				},
				{
					eventType: DUNGEON_EVENTS.RETURN_TO_ENTRANCE,
					guard: FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED,
					id: `${TEST_GRAPH_EDGE_IDS.ENTRANCE_TO_GUARD_ROOM}:reverse`,
					source: ROOM_IDS.GUARD_ROOM,
					target: ROOM_IDS.ENTRANCE,
				},
			],
			collisionNodes,
		);
		const collisionGroupSizes = flowEdges.flatMap((flowEdge) =>
			(flowEdge.data?.guardMarkers ?? []).map(
				(marker) => marker.collisionGroupSize,
			),
		);

		expect(collisionGroupSizes).toEqual([2, 2]);
	});
});
