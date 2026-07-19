import { describe, expect, it } from "vitest";

import { MACHINE_GRAPH_LAYOUT } from "@/features/state-visualizer";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_GUARD_MARKER_INTERACTION,
} from "../config";
import { createGuardMarkerEdgeLayoutViewModel } from "./guardMarkerEdgeLayoutViewModel";

const TEST_LAYOUT_INPUT = {
	labelX: 200,
	labelY: 160,
	markerColor: "var(--dungeon-gold)",
	markerCount: 2,
	markerIndex: 0,
	markerLaneOffset: 18,
	directionIndicatorMode:
		INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE,
	sourceX: 200,
	sourceY: 40,
	targetX: 200,
	targetY: 360,
} as const;

describe("createGuardMarkerEdgeLayoutViewModel", () => {
	it("returns desktop vertical marker layout with expected arrow metadata", () => {
		const result = createGuardMarkerEdgeLayoutViewModel({
			...TEST_LAYOUT_INPUT,
			isDesktopLayout: true,
			isLandscape: true,
		});

		expect(result.markerButtonStyles.left).toBe(
			TEST_LAYOUT_INPUT.labelX +
				TEST_LAYOUT_INPUT.markerLaneOffset -
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_GAP_PX / 2,
		);
		expect(result.markerButtonStyles.top).toBe(
			TEST_LAYOUT_INPUT.labelY +
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_DIRECTION_OFFSET_PX,
		);
		expect(result.markerArrows).toHaveLength(1);
		expect(result.markerArrows[0]?.symbol).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.VERTICAL.POS,
		);
		expect(result.hasDirectionIndicators).toBe(true);
	});

	it("keeps reverse collision slots at least one hit area apart", () => {
		const firstResult = createGuardMarkerEdgeLayoutViewModel({
			...TEST_LAYOUT_INPUT,
			labelX: 67,
			markerCount: 1,
			markerLaneOffset: 0,
			collisionOrder: 1,
			collisionGroupSize: 2,
			isDesktopLayout: true,
			isLandscape: true,
		});
		const secondResult = createGuardMarkerEdgeLayoutViewModel({
			...TEST_LAYOUT_INPUT,
			labelX: 94,
			markerCount: 1,
			markerLaneOffset: 0,
			collisionOrder: 0,
			collisionGroupSize: 2,
			isDesktopLayout: true,
			isLandscape: true,
		});
		const markerDistance = Math.abs(
			Number(firstResult.markerButtonStyles.left) -
				Number(secondResult.markerButtonStyles.left),
		);

		expect(markerDistance).toBeGreaterThanOrEqual(
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_HIT_AREA_PX,
		);
	});

	it("rechecks node clearance after applying collision spacing", () => {
		const nearbyNodePosition = { x: 220, y: 174 };
		const result = createGuardMarkerEdgeLayoutViewModel({
			...TEST_LAYOUT_INPUT,
			labelX: 100,
			markerCount: 1,
			markerLaneOffset: 0,
			collisionOrder: 1,
			collisionGroupSize: 2,
			nearbyNodePositions: [nearbyNodePosition],
			isDesktopLayout: true,
			isLandscape: true,
		});
		const markerCenterX = Number(result.markerButtonStyles.left);
		const markerCenterY = Number(result.markerButtonStyles.top);
		const markerHalfSize = INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX / 2;
		const expandedHalfWidth =
			MACHINE_GRAPH_LAYOUT.NODE_WIDTH / 2 +
			markerHalfSize +
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;
		const expandedHalfHeight =
			MACHINE_GRAPH_LAYOUT.NODE_HEIGHT / 2 +
			markerHalfSize +
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;
		const overlapsNode =
			Math.abs(markerCenterX - nearbyNodePosition.x) < expandedHalfWidth &&
			Math.abs(markerCenterY - nearbyNodePosition.y) < expandedHalfHeight;

		expect(overlapsNode).toBe(false);
	});
});
