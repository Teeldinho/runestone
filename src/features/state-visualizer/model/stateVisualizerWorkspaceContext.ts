import { createContext, useContext } from "react";

import { STATE_VISUALIZER_ERROR_MESSAGES } from "../config";
import type { StateVisualizerWorkspaceStore } from "./stateVisualizerWorkspaceStore";
import type { StateVisualizerSectionId } from "./types";

type StateVisualizerWorkspaceContextValue = {
	selectedSectionId: StateVisualizerSectionId;
	handleSelectedSectionIdChange: (sectionId: StateVisualizerSectionId) => void;
};

const stateVisualizerWorkspaceContext =
	createContext<StateVisualizerWorkspaceStore | null>(null);

const useRequiredStateVisualizerWorkspaceStore =
	(): StateVisualizerWorkspaceStore => {
		const stateVisualizerWorkspaceStore = useContext(
			stateVisualizerWorkspaceContext,
		);

		if (!stateVisualizerWorkspaceStore) {
			throw new Error(
				STATE_VISUALIZER_ERROR_MESSAGES.WORKSPACE_PROVIDER_REQUIRED,
			);
		}

		return stateVisualizerWorkspaceStore;
	};

export type { StateVisualizerWorkspaceContextValue };
export {
	stateVisualizerWorkspaceContext,
	useRequiredStateVisualizerWorkspaceStore,
};
