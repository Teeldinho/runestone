import type { CSSProperties } from "react";

import {
	type MachineGraphSection,
	type StateVisualizerSectionId,
} from "@/features/state-visualizer";

import { INSPECTOR_REACT_FLOW_DEFAULTS } from "../config";
import {
	createXStateInspectorPanelViewModel,
	createXStateInspectorSectionViewModels,
	type InspectorGuardDetail,
	type InspectorGuardIndicator,
	type InspectorMachineSectionViewModel,
	type InspectorStateDetail,
	type InspectorTransitionDetail,
} from "../lib";
import { useXStateInspectorPanelSelection } from "./useXStateInspectorPanelSelection";

type UseXStateInspectorPanelInput = {
	sections: MachineGraphSection[];
};

type XStateInspectorPanelViewModel = {
	sectionTabs: Array<{
		id: StateVisualizerSectionId;
		label: string;
	}>;
	selectedSectionId: StateVisualizerSectionId;
	handleSelectedSectionIdChange: (sectionId: string) => void;
	selectedSection: InspectorMachineSectionViewModel | null;
	sections: InspectorMachineSectionViewModel[];
	reactFlowDefaults: typeof INSPECTOR_REACT_FLOW_DEFAULTS;
	selectedFlowFitViewPadding: number;
	tabsListStyles: CSSProperties;
	hasSelectedSection: boolean;
	hasGuardIndicators: boolean;
};

export const useXStateInspectorPanel = ({
	sections,
}: UseXStateInspectorPanelInput): XStateInspectorPanelViewModel => {
	const sectionViewModels = createXStateInspectorSectionViewModels(sections);
	const { selectedSectionId, handleSelectedSectionIdChange } =
		useXStateInspectorPanelSelection(sectionViewModels);
	const panelViewModel = createXStateInspectorPanelViewModel({
		sectionViewModels,
		selectedSectionId,
	});

	return {
		sections: sectionViewModels,
		sectionTabs: panelViewModel.sectionTabs,
		selectedSectionId,
		handleSelectedSectionIdChange,
		selectedSection: panelViewModel.selectedSection,
		reactFlowDefaults: INSPECTOR_REACT_FLOW_DEFAULTS,
		selectedFlowFitViewPadding: panelViewModel.selectedFlowFitViewPadding,
		tabsListStyles: panelViewModel.tabsListStyles,
		hasSelectedSection: panelViewModel.hasSelectedSection,
		hasGuardIndicators: panelViewModel.hasGuardIndicators,
	};
};

export type {
	InspectorGuardDetail,
	InspectorGuardIndicator,
	InspectorMachineSectionViewModel,
	InspectorStateDetail,
	InspectorTransitionDetail,
	UseXStateInspectorPanelInput,
	XStateInspectorPanelViewModel,
};
