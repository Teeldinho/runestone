import { describe, expect, it } from "vitest";

import {
	STATE_VISUALIZER_SECTION_IDS,
	type StateVisualizerSectionId,
} from "@/features/state-visualizer";

import { INSPECTOR_REACT_FLOW_SECTION_PADDING } from "../config";
import type { InspectorMachineSectionViewModel } from "./inspectorSectionViewModel";
import {
	createInspectorSectionIdSet,
	createXStateInspectorSectionViewModels,
	createXStateInspectorPanelViewModel,
	resolveFallbackSelectedSectionId,
} from "./xStateInspectorPanelViewModel";

const createInspectorSectionViewModel = (
	id: StateVisualizerSectionId,
	overrides?: Partial<InspectorMachineSectionViewModel>,
): InspectorMachineSectionViewModel => ({
	id,
	label: id,
	activeStateLabel: "active",
	activeStateSummary: "summary",
	sectionDescription: "description",
	guardDetails: [],
	guardIndicators: [],
	transitionDetails: [],
	flowEdges: [],
	flowNodes: [],
	graphEdges: [],
	graphNodes: [],
	stateDetails: [],
	hasGuardIndicators: false,
	...overrides,
});

describe("xStateInspectorPanelViewModel", () => {
	it("creates section tabs and selected section metadata", () => {
		const dungeonSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
			{ hasGuardIndicators: true },
		);
		const cameraSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);

		const result = createXStateInspectorPanelViewModel({
			sectionViewModels: [dungeonSection, cameraSection],
			selectedSectionId: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		});

		expect(result.sectionTabs).toEqual([
			{ id: STATE_VISUALIZER_SECTION_IDS.DUNGEON, label: dungeonSection.label },
			{ id: STATE_VISUALIZER_SECTION_IDS.CAMERA, label: cameraSection.label },
		]);
		expect(result.selectedSection).toBe(dungeonSection);
		expect(result.hasSelectedSection).toBe(true);
		expect(result.hasGuardIndicators).toBe(true);
		expect(result.tabsListStyles).toEqual({
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		});
	});

	it("uses camera padding when camera section is selected", () => {
		const cameraSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);

		const result = createXStateInspectorPanelViewModel({
			sectionViewModels: [cameraSection],
			selectedSectionId: STATE_VISUALIZER_SECTION_IDS.CAMERA,
		});

		expect(result.selectedFlowFitViewPadding).toBe(
			INSPECTOR_REACT_FLOW_SECTION_PADDING.CAMERA,
		);
	});

	it("resolves fallback section only when current selection is missing", () => {
		const dungeonSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);
		const playerSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.PLAYER,
		);

		expect(
			resolveFallbackSelectedSectionId(
				[dungeonSection, playerSection],
				STATE_VISUALIZER_SECTION_IDS.DUNGEON,
			),
		).toBeNull();
		expect(
			resolveFallbackSelectedSectionId(
				[dungeonSection, playerSection],
				STATE_VISUALIZER_SECTION_IDS.CAMERA,
			),
		).toBe(STATE_VISUALIZER_SECTION_IDS.DUNGEON);
		expect(
			resolveFallbackSelectedSectionId([], STATE_VISUALIZER_SECTION_IDS.CAMERA),
		).toBeNull();
	});

	it("creates a section id set for valid tab-change checks", () => {
		const sectionIdSet = createInspectorSectionIdSet([
			createInspectorSectionViewModel(STATE_VISUALIZER_SECTION_IDS.DUNGEON),
			createInspectorSectionViewModel(STATE_VISUALIZER_SECTION_IDS.CAMERA),
		]);

		expect(sectionIdSet.has(STATE_VISUALIZER_SECTION_IDS.DUNGEON)).toBe(true);
		expect(sectionIdSet.has(STATE_VISUALIZER_SECTION_IDS.CAMERA)).toBe(true);
		expect(sectionIdSet.has(STATE_VISUALIZER_SECTION_IDS.AUDIO)).toBe(false);
	});

	it("maps machine graph sections to inspector section view models", () => {
		const dungeonSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
			{ hasGuardIndicators: true },
		);
		const cameraSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);

		const result = createXStateInspectorSectionViewModels([
			{
				activeStateLabel: "active",
				edges: [],
				guardKeys: [],
				id: dungeonSection.id,
				label: dungeonSection.label,
				nodes: [],
				positionedNodes: [],
			},
			{
				activeStateLabel: "active",
				edges: [],
				guardKeys: [],
				id: cameraSection.id,
				label: cameraSection.label,
				nodes: [],
				positionedNodes: [],
			},
		]);

		expect(result).toHaveLength(2);
		expect(result[0]).toMatchObject({
			id: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
			label: dungeonSection.label,
		});
		expect(result[1]).toMatchObject({
			id: STATE_VISUALIZER_SECTION_IDS.CAMERA,
			label: cameraSection.label,
		});
	});
});
