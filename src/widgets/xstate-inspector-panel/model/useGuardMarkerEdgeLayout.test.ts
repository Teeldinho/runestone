// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { Position } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

import { MACHINE_GRAPH_LAYOUT } from "@/features/state-visualizer";
import { useResponsiveLayout } from "@/shared/lib";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_GUARD_MARKER_INTERACTION,
} from "../config";

import { useGuardMarkerEdgeLayout } from "./useGuardMarkerEdgeLayout";

vi.mock("@/shared/lib", () => ({
	useResponsiveLayout: vi.fn(),
}));

const TEST_MARKER_LAYOUT_INPUT = {
	labelX: 200,
	labelY: 160,
	markerColor: "var(--dungeon-gold)",
	markerCount: 2,
	markerIndex: 0,
	markerLaneOffset: 18,
	directionIndicatorMode:
		INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE,
} as const;

describe("useGuardMarkerEdgeLayout", () => {
	it("staggers vertical desktop guard markers across the x axis and shows vertical arrows", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				sourceX: 200,
				sourceY: 40,
				targetX: 200,
				targetY: 360,
			}),
		);

		expect(result.current.markerButtonStyles.left).toBe(205);
		expect(result.current.markerButtonStyles.top).toBe(174);
		expect(result.current.markerArrows[0]?.symbol).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.VERTICAL.POS,
		);
		expect(result.current.markerArrows[0]?.styles.left).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT,
		);
	});

	it("staggers horizontal tablet markers across the y axis and shows horizontal arrows", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				sourceX: 40,
				sourceY: 140,
				targetX: 360,
				targetY: 140,
			}),
		);

		expect(result.current.markerButtonStyles.left).toBe(212);
		expect(result.current.markerButtonStyles.top).toBe(167);
		expect(result.current.markerArrows[0]?.symbol).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL.POS,
		);
		expect(result.current.markerArrows[0]?.styles.top).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT,
		);
	});

	it("offsets single-direction markers off the edge centerline", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				markerCount: 1,
				directionIndicatorMode:
					INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
				collisionSeed: "test-seed",
				sourceX: 200,
				sourceY: 40,
				targetX: 200,
				targetY: 360,
			}),
		);

		expect(result.current.markerButtonStyles.top).toBe(170);
		expect(result.current.hasDirectionIndicators).toBe(false);
	});

	it("renders dual arrows from a single marker in bidirectional mode", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				directionIndicatorMode:
					INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.DUAL,
				sourceX: 40,
				sourceY: 140,
				targetX: 360,
				targetY: 140,
			}),
		);

		expect(result.current.markerArrows).toHaveLength(2);
		expect(result.current.markerArrows[0]?.symbol).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL.POS,
		);
		expect(result.current.markerArrows[1]?.symbol).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL.NEG,
		);
	});

	it("keeps dual arrows opposite on reverse-oriented horizontal edges", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				directionIndicatorMode:
					INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.DUAL,
				sourceX: 360,
				sourceY: 140,
				targetX: 40,
				targetY: 140,
			}),
		);

		expect(result.current.markerArrows).toHaveLength(2);
		expect(result.current.markerArrows[0]?.symbol).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL.NEG,
		);
		expect(result.current.markerArrows[1]?.symbol).toBe(
			INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL.POS,
		);
	});

	it("repositions overlapping markers outside node bounds when handle positions are available", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const markerHalfSize = INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX / 2;
		const expandedHalfHeight =
			MACHINE_GRAPH_LAYOUT.NODE_HEIGHT / 2 +
			markerHalfSize +
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;
		const targetHandleY = 270;
		const targetCenterY = targetHandleY + MACHINE_GRAPH_LAYOUT.NODE_HEIGHT / 2;

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				sourceX: 200,
				sourceY: 130,
				targetX: 200,
				targetY: targetHandleY,
				sourcePosition: Position.Bottom,
				targetPosition: Position.Top,
				labelY: 250,
				markerCount: 1,
				markerIndex: 0,
				markerLaneOffset: 0,
			}),
		);

		expect(result.current.markerButtonStyles.top).toBe(
			targetCenterY - expandedHalfHeight,
		);
	});

	it("applies deterministic desktop jitter for vertical marker collisions", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const baseLaneLeft =
			TEST_MARKER_LAYOUT_INPUT.labelX +
			TEST_MARKER_LAYOUT_INPUT.markerLaneOffset -
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_GAP_PX / 2;

		const { result: firstResult } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				collisionSeed: "guard-marker-a",
				sourceX: 200,
				sourceY: 40,
				targetX: 200,
				targetY: 360,
			}),
		);
		const { result: secondResult } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				collisionSeed: "guard-marker-b",
				sourceX: 200,
				sourceY: 40,
				targetX: 200,
				targetY: 360,
			}),
		);

		expect(firstResult.current.markerButtonStyles.left).not.toBe(baseLaneLeft);
		expect(secondResult.current.markerButtonStyles.left).not.toBe(baseLaneLeft);
		expect(firstResult.current.markerButtonStyles.left).not.toBe(
			secondResult.current.markerButtonStyles.left,
		);
	});

	it("applies desktop global collision spacing within shared marker groups", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const { result: firstResult } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				sourceX: 200,
				sourceY: 40,
				targetX: 200,
				targetY: 360,
				collisionOrder: 0,
				collisionGroupSize: 2,
			}),
		);
		const { result: secondResult } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				sourceX: 200,
				sourceY: 40,
				targetX: 200,
				targetY: 360,
				collisionOrder: 1,
				collisionGroupSize: 2,
			}),
		);

		expect(firstResult.current.markerButtonStyles.left).not.toBe(
			secondResult.current.markerButtonStyles.left,
		);
	});

	it("repositions overlapping markers when edge handle positions are unavailable", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const markerHalfSize = INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX / 2;
		const expandedHalfHeight =
			MACHINE_GRAPH_LAYOUT.NODE_HEIGHT / 2 +
			markerHalfSize +
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;
		const targetHandleY = 270;
		const targetCenterY = targetHandleY + MACHINE_GRAPH_LAYOUT.NODE_HEIGHT / 2;

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				sourceX: 200,
				sourceY: 130,
				targetX: 200,
				targetY: targetHandleY,
				labelY: 250,
				markerCount: 1,
				markerIndex: 0,
				markerLaneOffset: 0,
			}),
		);

		expect(result.current.markerButtonStyles.top).toBe(
			targetCenterY - expandedHalfHeight,
		);
	});

	it("uses side clearance for horizontal self-loop markers on desktop", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const markerHalfSize = INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX / 2;
		const expandedHalfWidth =
			MACHINE_GRAPH_LAYOUT.NODE_WIDTH / 2 +
			markerHalfSize +
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;
		const nodeCenterX = 200;

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				directionIndicatorMode:
					INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
				sourceX: 280,
				sourceY: 160,
				targetX: 120,
				targetY: 160,
				sourcePosition: Position.Right,
				targetPosition: Position.Left,
				labelX: nodeCenterX,
				labelY: 160,
				markerCount: 1,
				markerIndex: 0,
				markerLaneOffset: 0,
			}),
		);

		expect(result.current.markerButtonStyles.left).toBe(
			nodeCenterX + expandedHalfWidth,
		);
		expect(result.current.markerButtonStyles.top).toBe(160);
	});

	it("moves out-of-bounds desktop self-loop markers off the central lane", () => {
		vi.mocked(useResponsiveLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
		} as ReturnType<typeof useResponsiveLayout>);

		const markerHalfSize = INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX / 2;
		const expandedHalfWidth =
			MACHINE_GRAPH_LAYOUT.NODE_WIDTH / 2 +
			markerHalfSize +
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX;
		const nodeCenterX = 200;

		const { result } = renderHook(() =>
			useGuardMarkerEdgeLayout({
				...TEST_MARKER_LAYOUT_INPUT,
				directionIndicatorMode:
					INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE,
				sourceX: 200,
				sourceY: 304,
				targetX: 200,
				targetY: 304,
				isSelfLoopTransition: true,
				sourcePosition: Position.Top,
				targetPosition: Position.Bottom,
				labelX: nodeCenterX,
				labelY: 250,
				markerCount: 1,
				markerIndex: 0,
				markerLaneOffset: 0,
			}),
		);

		expect(result.current.markerButtonStyles.left).toBe(
			nodeCenterX + expandedHalfWidth,
		);
		expect(result.current.markerButtonStyles.top).toBe(260);
	});
});
