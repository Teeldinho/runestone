import { Position } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { MACHINE_GRAPH_LAYOUT } from "@/features/state-visualizer";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_GUARD_MARKER_INTERACTION,
} from "../config";

import {
	resolveGuardMarkerAdditionalNodeClearance,
	resolveGuardMarkerDirectionalNodeClearance,
	resolveGuardMarkerInferredNodeCenterFromHandle,
	resolveGuardMarkerNodeCenterFromHandle,
	resolveGuardMarkerNodeOverlapClearance,
	resolveGuardMarkerSelfLoopClearance,
} from "./guardMarkerNodeClearanceHelpers";

const nodeHalfWidth = MACHINE_GRAPH_LAYOUT.NODE_WIDTH / 2;
const nodeHalfHeight = MACHINE_GRAPH_LAYOUT.NODE_HEIGHT / 2;
const markerHalfSize = INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX / 2;
const expandedHalfWidth =
	nodeHalfWidth +
	markerHalfSize +
	INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;
const expandedHalfHeight =
	nodeHalfHeight +
	markerHalfSize +
	INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;

describe("guardMarkerNodeClearanceHelpers", () => {
	it("resolves node centers from handles", () => {
		expect(
			resolveGuardMarkerNodeCenterFromHandle({
				handleX: 200,
				handleY: 120,
				handlePosition: Position.Bottom,
				nodeHalfWidth,
				nodeHalfHeight,
			}),
		).toEqual({ x: 200, y: 120 - nodeHalfHeight });

		expect(
			resolveGuardMarkerNodeCenterFromHandle({
				handleX: 120,
				handleY: 200,
				handlePosition: Position.Right,
				nodeHalfWidth,
				nodeHalfHeight,
			}),
		).toEqual({ x: 120 - nodeHalfWidth, y: 200 });

		expect(
			resolveGuardMarkerNodeCenterFromHandle({
				handleX: 160,
				handleY: 220,
				handlePosition: Position.Top,
				nodeHalfWidth,
				nodeHalfHeight,
			}),
		).toEqual({ x: 160, y: 220 + nodeHalfHeight });

		expect(
			resolveGuardMarkerNodeCenterFromHandle({
				handleX: 260,
				handleY: 180,
				handlePosition: Position.Left,
				nodeHalfWidth,
				nodeHalfHeight,
			}),
		).toEqual({ x: 260 + nodeHalfWidth, y: 180 });
	});

	it("infers node centers from edge geometry when handles are missing", () => {
		expect(
			resolveGuardMarkerInferredNodeCenterFromHandle({
				handleX: 200,
				handleY: 120,
				sourceX: 160,
				sourceY: 120,
				targetX: 260,
				targetY: 120,
				isSourceNode: true,
				isHorizontal: true,
				nodeHalfWidth,
				nodeHalfHeight,
			}),
		).toEqual({ x: 200 - nodeHalfWidth, y: 120 });

		expect(
			resolveGuardMarkerInferredNodeCenterFromHandle({
				handleX: 200,
				handleY: 120,
				sourceX: 200,
				sourceY: 160,
				targetX: 200,
				targetY: 260,
				isSourceNode: false,
				isHorizontal: false,
				nodeHalfWidth,
				nodeHalfHeight,
			}),
		).toEqual({ x: 200, y: 120 + nodeHalfHeight });
	});

	it("pushes overlapping markers past the nearest node boundary", () => {
		expect(
			resolveGuardMarkerNodeOverlapClearance({
				markerCenter: { x: 200, y: 200 },
				nodeCenter: { x: 200, y: 200 },
				expandedHalfWidth,
				expandedHalfHeight,
				fallbackDirectionSign: 1,
			}),
		).toEqual({ x: 200, y: 200 + expandedHalfHeight });

		expect(
			resolveGuardMarkerNodeOverlapClearance({
				markerCenter: {
					x: 200 + expandedHalfWidth - 1,
					y: 200 + expandedHalfHeight - 1,
				},
				nodeCenter: { x: 200, y: 200 },
				expandedHalfWidth,
				expandedHalfHeight,
				fallbackDirectionSign: -1,
			}),
		).toEqual({
			x: 200 + expandedHalfWidth,
			y: 200 + expandedHalfHeight - 1,
		});
	});

	it("applies directional source and target clearance on the movement axis", () => {
		expect(
			resolveGuardMarkerDirectionalNodeClearance({
				markerCenter: { x: 200, y: 200 },
				sourceNodeCenter: { x: 200, y: 200 },
				targetNodeCenter: {
					x: 200 + expandedHalfWidth - 1,
					y: 200,
				},
				expandedHalfWidth,
				expandedHalfHeight,
				isHorizontal: true,
				directionSign: 1,
			}),
		).toEqual({
			x: 200 + expandedHalfWidth - 1 - expandedHalfWidth,
			y: 200,
		});
	});

	it("applies self-loop clearance on the requested axis", () => {
		expect(
			resolveGuardMarkerSelfLoopClearance({
				markerCenter: { x: 200, y: 200 },
				sourceNodeCenter: { x: 200, y: 200 },
				targetNodeCenter: { x: 200, y: 200 },
				expandedHalfWidth,
				expandedHalfHeight,
				isHorizontal: true,
				directionSign: 1,
				fallbackDirectionSign: 1,
				directionIndicatorMode:
					INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
				selfLoopClearanceAxisPreference:
					INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X,
			}),
		).toEqual({ x: 200 + expandedHalfWidth, y: 200 });

		expect(
			resolveGuardMarkerSelfLoopClearance({
				markerCenter: { x: 200, y: 200 },
				sourceNodeCenter: { x: 200, y: 200 },
				targetNodeCenter: { x: 200, y: 200 },
				expandedHalfWidth,
				expandedHalfHeight,
				isHorizontal: false,
				directionSign: -1,
				fallbackDirectionSign: 1,
				directionIndicatorMode:
					INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE,
			}),
		).toEqual({ x: 200, y: 200 - expandedHalfHeight });
	});

	it("keeps pushing markers away from overlapping nearby nodes", () => {
		const result = resolveGuardMarkerAdditionalNodeClearance({
			markerCenter: { x: 200, y: 200 },
			additionalNodeCenters: [
				{ x: 200, y: 200 },
				{ x: 200 + expandedHalfWidth, y: 200 },
			],
			expandedHalfWidth,
			expandedHalfHeight,
			fallbackDirectionSign: 1,
		});

		const isStillInsideFirstNode =
			Math.abs(result.x - 200) < expandedHalfWidth &&
			Math.abs(result.y - 200) < expandedHalfHeight;
		const isStillInsideSecondNode =
			Math.abs(result.x - (200 + expandedHalfWidth)) < expandedHalfWidth &&
			Math.abs(result.y - 200) < expandedHalfHeight;

		expect(isStillInsideFirstNode).toBe(false);
		expect(isStillInsideSecondNode).toBe(false);
	});
});
