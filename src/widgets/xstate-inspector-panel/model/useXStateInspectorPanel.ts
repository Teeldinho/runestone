import { type CSSProperties, useCallback, useEffect, useMemo } from "react";

import {
	type MachineGraphSection,
	STATE_VISUALIZER_SECTION_IDS,
	type StateVisualizerSectionId,
	useStateVisualizerWorkspace,
} from "@/features/state-visualizer";

import {
	INSPECTOR_REACT_FLOW_DEFAULTS,
	INSPECTOR_REACT_FLOW_SECTION_PADDING,
} from "../config";
import {
	createInspectorMachineSectionViewModel,
	type InspectorGuardDetail,
	type InspectorGuardIndicator,
	type InspectorMachineSectionViewModel,
	type InspectorStateDetail,
	type InspectorTransitionDetail,
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
		() => new Set(sectionViewModels.map((section) => section.id)),
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
		if (sectionViewModels.length === 0) {
			return;
		}

		if (sectionViewModels.some((section) => section.id === selectedSectionId)) {
			return;
		}

		handleSelectedSectionIdChange(sectionViewModels[0].id);
	}, [handleSelectedSectionIdChange, sectionViewModels, selectedSectionId]);

	const selectedSection =
		sectionViewModels.find((section) => section.id === selectedSectionId) ??
		null;

	return {
		sectionTabs: sectionViewModels.map((section) => ({
			id: section.id,
			label: section.label,
		})),
		selectedSectionId,
		handleSelectedSectionIdChange: handleSelectedSectionChange,
		selectedSection,
		sections: sectionViewModels,
		reactFlowDefaults: INSPECTOR_REACT_FLOW_DEFAULTS,
		selectedFlowFitViewPadding:
			selectedSectionId === STATE_VISUALIZER_SECTION_IDS.CAMERA
				? INSPECTOR_REACT_FLOW_SECTION_PADDING.CAMERA
				: INSPECTOR_REACT_FLOW_DEFAULTS.FIT_VIEW_PADDING,
		tabsListStyles: {
			gridTemplateColumns: `repeat(${sectionViewModels.length}, minmax(0, 1fr))`,
		},
		hasSelectedSection: selectedSection !== null,
		hasGuardIndicators: selectedSection?.hasGuardIndicators ?? false,
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
