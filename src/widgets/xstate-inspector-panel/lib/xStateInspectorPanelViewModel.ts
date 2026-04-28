import type { CSSProperties } from "react";

import {
	type MachineGraphSection,
	STATE_VISUALIZER_SECTION_IDS,
	type StateVisualizerSectionId,
} from "@/features/state-visualizer";

import {
	INSPECTOR_REACT_FLOW_DEFAULTS,
	INSPECTOR_REACT_FLOW_SECTION_PADDING,
} from "../config";
import type { InspectorMachineSectionViewModel } from "./inspectorSectionViewModel";
import { createInspectorMachineSectionViewModel } from "./inspectorSectionViewModel";

export const createXStateInspectorSectionViewModels = (
	sections: MachineGraphSection[],
): InspectorMachineSectionViewModel[] =>
	sections.map(createInspectorMachineSectionViewModel);

type XStateInspectorPanelSectionTab = {
	id: StateVisualizerSectionId;
	label: string;
};

type XStateInspectorPanelDerivedViewModel = {
	sectionTabs: XStateInspectorPanelSectionTab[];
	selectedSection: InspectorMachineSectionViewModel | null;
	selectedFlowFitViewPadding: number;
	tabsListStyles: CSSProperties;
	hasSelectedSection: boolean;
	hasGuardIndicators: boolean;
};

type CreateXStateInspectorPanelViewModelInput = {
	sectionViewModels: InspectorMachineSectionViewModel[];
	selectedSectionId: StateVisualizerSectionId;
};

export const createInspectorSectionIdSet = (
	sectionViewModels: InspectorMachineSectionViewModel[],
): ReadonlySet<StateVisualizerSectionId> =>
	new Set(sectionViewModels.map((section) => section.id));

export const resolveFallbackSelectedSectionId = (
	sectionViewModels: InspectorMachineSectionViewModel[],
	selectedSectionId: StateVisualizerSectionId,
): StateVisualizerSectionId | null => {
	if (sectionViewModels.length === 0) {
		return null;
	}

	if (sectionViewModels.some((section) => section.id === selectedSectionId)) {
		return null;
	}

	return sectionViewModels[0].id;
};

const resolveSelectedFlowFitViewPadding = (
	selectedSectionId: StateVisualizerSectionId,
): number =>
	selectedSectionId === STATE_VISUALIZER_SECTION_IDS.CAMERA
		? INSPECTOR_REACT_FLOW_SECTION_PADDING.CAMERA
		: INSPECTOR_REACT_FLOW_DEFAULTS.FIT_VIEW_PADDING;

const createTabsListStyles = (
	sectionViewModels: InspectorMachineSectionViewModel[],
): CSSProperties => ({
	gridTemplateColumns: `repeat(${sectionViewModels.length}, minmax(0, 1fr))`,
});

export const createXStateInspectorPanelViewModel = ({
	sectionViewModels,
	selectedSectionId,
}: CreateXStateInspectorPanelViewModelInput): XStateInspectorPanelDerivedViewModel => {
	const selectedSection =
		sectionViewModels.find((section) => section.id === selectedSectionId) ??
		null;

	return {
		sectionTabs: sectionViewModels.map((section) => ({
			id: section.id,
			label: section.label,
		})),
		selectedSection,
		selectedFlowFitViewPadding:
			resolveSelectedFlowFitViewPadding(selectedSectionId),
		tabsListStyles: createTabsListStyles(sectionViewModels),
		hasSelectedSection: selectedSection !== null,
		hasGuardIndicators: selectedSection?.hasGuardIndicators ?? false,
	};
};

export type {
	CreateXStateInspectorPanelViewModelInput,
	XStateInspectorPanelDerivedViewModel,
	XStateInspectorPanelSectionTab,
};
