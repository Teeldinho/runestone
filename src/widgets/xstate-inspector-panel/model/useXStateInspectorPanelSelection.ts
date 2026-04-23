import { useEffect } from "react";

import {
	type StateVisualizerSectionId,
	useStateVisualizerWorkspace,
} from "@/features/state-visualizer";

import {
	createInspectorSectionIdSet,
	resolveFallbackSelectedSectionId,
	type InspectorMachineSectionViewModel,
} from "../lib";

type UseXStateInspectorPanelSelectionResult = {
	selectedSectionId: StateVisualizerSectionId;
	handleSelectedSectionIdChange: (sectionId: string) => void;
};

export const useXStateInspectorPanelSelection = (
	sectionViewModels: InspectorMachineSectionViewModel[],
): UseXStateInspectorPanelSelectionResult => {
	const {
		selectedSectionId: workspaceSelectedSectionId,
		handleSelectedSectionIdChange,
	} = useStateVisualizerWorkspace();

	const fallbackSelectedSectionId = resolveFallbackSelectedSectionId(
		sectionViewModels,
		workspaceSelectedSectionId,
	);
	const selectedSectionId =
		fallbackSelectedSectionId ?? workspaceSelectedSectionId;
	const sectionIdSet = createInspectorSectionIdSet(sectionViewModels);

	useEffect(() => {
		if (fallbackSelectedSectionId === null) {
			return;
		}

		handleSelectedSectionIdChange(fallbackSelectedSectionId);
	}, [fallbackSelectedSectionId, handleSelectedSectionIdChange]);

	const handleValidatedSelectedSectionIdChange = (sectionId: string) => {
		if (!sectionIdSet.has(sectionId as StateVisualizerSectionId)) {
			return;
		}

		handleSelectedSectionIdChange(sectionId as StateVisualizerSectionId);
	};

	return {
		selectedSectionId,
		handleSelectedSectionIdChange: handleValidatedSelectedSectionIdChange,
	};
};

export type {
	UseXStateInspectorPanelSelectionResult,
};
