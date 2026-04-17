import { describe, expect, it } from "vitest";

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
});
