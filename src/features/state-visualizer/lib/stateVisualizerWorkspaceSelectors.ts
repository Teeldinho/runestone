import type { StateVisualizerSectionId } from "../model/types";

type StateVisualizerWorkspaceState = {
	selectedSectionId: StateVisualizerSectionId;
	handleSelectedSectionIdChange: (sectionId: StateVisualizerSectionId) => void;
};

export const selectStateVisualizerWorkspaceSelectedSectionId = (
	state: StateVisualizerWorkspaceState,
): StateVisualizerSectionId => state.selectedSectionId;

export const selectStateVisualizerWorkspaceHandleSelectedSectionIdChange = (
	state: StateVisualizerWorkspaceState,
): ((sectionId: StateVisualizerSectionId) => void) =>
	state.handleSelectedSectionIdChange;

export type { StateVisualizerWorkspaceState };
