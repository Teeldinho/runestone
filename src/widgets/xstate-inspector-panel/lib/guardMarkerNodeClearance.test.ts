import { Position } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { MACHINE_GRAPH_LAYOUT } from "@/features/state-visualizer";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_GUARD_MARKER_INTERACTION,
} from "../config";
import { resolveGuardMarkerNodeClearance } from "./guardMarkerNodeClearance";

const markerHalfSize = INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX / 2;
const expandedHalfWidth =
	MACHINE_GRAPH_LAYOUT.NODE_WIDTH / 2 +
	markerHalfSize +
	INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;
const expandedHalfHeight =
	MACHINE_GRAPH_LAYOUT.NODE_HEIGHT / 2 +
	markerHalfSize +
	INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;

describe("resolveGuardMarkerNodeClearance", () => {
	it("returns the original marker center when node positions are unavailable", () => {
		const result = resolveGuardMarkerNodeClearance({
			markerCenterX: 200,
			markerCenterY: 180,
			sourceX: 200,
			sourceY: 120,
			targetX: 200,
			targetY: 260,
			isHorizontal: false,
			directionSign: 1,
			fallbackDirectionSign: 1,
			directionIndicatorMode:
				INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE,
			markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX,
			nodeClearanceOffset:
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX,
		});

		expect(result).toEqual({ x: 200, y: 180 });
	});

	it("infers node centers from edge geometry when handle positions are missing", () => {
		const result = resolveGuardMarkerNodeClearance({
			markerCenterX: 200,
			markerCenterY: 250,
			sourceX: 200,
			sourceY: 130,
			targetX: 200,
			targetY: 270,
			isHorizontal: false,
			directionSign: 1,
			fallbackDirectionSign: 1,
			directionIndicatorMode:
				INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE,
			markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX,
			nodeClearanceOffset:
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX,
		});

		expect(result.x).toBe(200);
		expect(result.y).toBe(300 - expandedHalfHeight);
	});

	it("pushes a marker above the target node when it overlaps the target bounds", () => {
		const result = resolveGuardMarkerNodeClearance({
			markerCenterX: 200,
			markerCenterY: 250,
			sourceX: 200,
			sourceY: 130,
			targetX: 200,
			targetY: 270,
			sourcePosition: Position.Bottom,
			targetPosition: Position.Top,
			isHorizontal: false,
			directionSign: 1,
			fallbackDirectionSign: 1,
			directionIndicatorMode:
				INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE,
			markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX,
			nodeClearanceOffset:
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX,
		});

		expect(result.x).toBe(200);
		expect(result.y).toBe(300 - expandedHalfHeight);
	});

	it("pushes a self-loop marker outside node bounds on the perpendicular axis", () => {
		const result = resolveGuardMarkerNodeClearance({
			markerCenterX: 200,
			markerCenterY: 160,
			sourceX: 200,
			sourceY: 190,
			targetX: 200,
			targetY: 130,
			sourcePosition: Position.Bottom,
			targetPosition: Position.Top,
			isHorizontal: false,
			directionSign: -1,
			fallbackDirectionSign: 1,
			directionIndicatorMode:
				INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
			markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX,
			nodeClearanceOffset:
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX,
		});

		expect(result.x).toBe(200 + expandedHalfWidth);
		expect(result.y).toBe(160);
	});

	it("prefers x-axis self-loop clearance when requested", () => {
		const result = resolveGuardMarkerNodeClearance({
			markerCenterX: 200,
			markerCenterY: 160,
			sourceX: 280,
			sourceY: 160,
			targetX: 120,
			targetY: 160,
			sourcePosition: Position.Right,
			targetPosition: Position.Left,
			isHorizontal: true,
			directionSign: 1,
			fallbackDirectionSign: 1,
			directionIndicatorMode:
				INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
			selfLoopClearanceAxisPreference:
				INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X,
			markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX,
			nodeClearanceOffset:
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX,
		});

		expect(result.x).toBe(200 + expandedHalfWidth);
		expect(result.y).toBe(160);
	});

	it("applies preferred self-loop clearance axis when marker is outside node bounds", () => {
		const result = resolveGuardMarkerNodeClearance({
			markerCenterX: 200,
			markerCenterY: 250,
			sourceX: 200,
			sourceY: 304,
			targetX: 200,
			targetY: 304,
			sourcePosition: Position.Top,
			targetPosition: Position.Top,
			isHorizontal: true,
			directionSign: 1,
			fallbackDirectionSign: 1,
			directionIndicatorMode:
				INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
			selfLoopClearanceAxisPreference:
				INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X,
			markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX,
			nodeClearanceOffset:
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX,
		});

		expect(result.x).toBe(200 + expandedHalfWidth);
		expect(result.y).toBe(250);
	});

	it("treats source-equals-target markers as self-loop even when handle centers differ", () => {
		const result = resolveGuardMarkerNodeClearance({
			markerCenterX: 200,
			markerCenterY: 250,
			sourceX: 200,
			sourceY: 304,
			targetX: 200,
			targetY: 304,
			isSelfLoopTransition: true,
			sourcePosition: Position.Top,
			targetPosition: Position.Bottom,
			isHorizontal: true,
			directionSign: 1,
			fallbackDirectionSign: 1,
			directionIndicatorMode:
				INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
			selfLoopClearanceAxisPreference:
				INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X,
			markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX,
			nodeClearanceOffset:
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX,
		});

		expect(result.x).toBe(200 + expandedHalfWidth);
		expect(result.y).toBe(250);
	});
});
