import { type CSSProperties, useCallback, useEffect, useMemo } from "react";

import {
	type MachineGraphSection,
	type StateVisualizerSectionId,
	useStateVisualizerWorkspace,
} from "@/features/state-visualizer";

import { INSPECTOR_REACT_FLOW_DEFAULTS } from "../config";
import {
	createInspectorMachineSectionViewModel,
	createInspectorSectionIdSet,
	createXStateInspectorPanelViewModel,
	type InspectorGuardDetail,
	type InspectorGuardIndicator,
	type InspectorMachineSectionViewModel,
	type InspectorStateDetail,
	type InspectorTransitionDetail,
	resolveFallbackSelectedSectionId,
} from "../lib";

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
	const { selectedSectionId, handleSelectedSectionIdChange } =
		useStateVisualizerWorkspace();

	const sectionViewModels = useMemo<InspectorMachineSectionViewModel[]>(
		() => sections.map(createInspectorMachineSectionViewModel),
		[sections],
	);

	const sectionIdSet = useMemo(
		() => createInspectorSectionIdSet(sectionViewModels),
		[sectionViewModels],
	);

	const handleSelectedSectionChange = useCallback(
		(sectionId: string) => {
			if (!sectionIdSet.has(sectionId as StateVisualizerSectionId)) {
				return;
			}

			handleSelectedSectionIdChange(sectionId as StateVisualizerSectionId);
		},
		[handleSelectedSectionIdChange, sectionIdSet],
	);

	useEffect(() => {
		const fallbackSelectedSectionId = resolveFallbackSelectedSectionId(
			sectionViewModels,
			selectedSectionId,
		);

		if (fallbackSelectedSectionId === null) {
			return;
		}

		handleSelectedSectionIdChange(fallbackSelectedSectionId);
	}, [handleSelectedSectionIdChange, sectionViewModels, selectedSectionId]);

	const panelViewModel = useMemo(
		() =>
			createXStateInspectorPanelViewModel({
				sectionViewModels,
				selectedSectionId,
			}),
		[sectionViewModels, selectedSectionId],
	);

	return {
		sectionTabs: panelViewModel.sectionTabs,
		selectedSectionId,
		handleSelectedSectionIdChange: handleSelectedSectionChange,
		selectedSection: panelViewModel.selectedSection,
		sections: sectionViewModels,
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
