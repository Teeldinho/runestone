// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import {
	STATE_VISUALIZER_SECTION_IDS,
	type StateVisualizerSectionId,
	StateVisualizerWorkspaceProvider,
} from "@/features/state-visualizer";

import type { InspectorMachineSectionViewModel } from "../lib";
import { useXStateInspectorPanelSelection } from "./useXStateInspectorPanelSelection";

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

describe("useXStateInspectorPanelSelection", () => {
	it("falls back to the first available section when the selected section is missing", () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<StateVisualizerWorkspaceProvider>
				{children}
			</StateVisualizerWorkspaceProvider>
		);

		const cameraSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);

		const { result } = renderHook(
			() => useXStateInspectorPanelSelection([cameraSection]),
			{ wrapper },
		);

		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);
	});

	it("rejects invalid section ids and accepts valid changes", () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<StateVisualizerWorkspaceProvider>
				{children}
			</StateVisualizerWorkspaceProvider>
		);

		const dungeonSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);
		const cameraSection = createInspectorSectionViewModel(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);

		const { result } = renderHook(
			() => useXStateInspectorPanelSelection([dungeonSection, cameraSection]),
			{ wrapper },
		);

		act(() => {
			result.current.handleSelectedSectionIdChange("invalid-section");
		});

		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);

		act(() => {
			result.current.handleSelectedSectionIdChange(
				STATE_VISUALIZER_SECTION_IDS.CAMERA,
			);
		});

		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);
	});

	it("keeps the workspace selection when no sections are available", () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<StateVisualizerWorkspaceProvider>
				{children}
			</StateVisualizerWorkspaceProvider>
		);

		const { result } = renderHook(() => useXStateInspectorPanelSelection([]), {
			wrapper,
		});

		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);
	});
});
