import { createStore, type StoreApi } from "zustand/vanilla";
import type { StateVisualizerWorkspaceState } from "../lib";
import type { StateVisualizerSectionId } from "./types";

export type StateVisualizerWorkspaceStore =
	StoreApi<StateVisualizerWorkspaceState>;

export const createStateVisualizerWorkspaceStore = (
	defaultSectionId: StateVisualizerSectionId,
): StateVisualizerWorkspaceStore =>
	createStore<StateVisualizerWorkspaceState>()((set) => ({
		selectedSectionId: defaultSectionId,
		handleSelectedSectionIdChange: (sectionId) => {
			set({ selectedSectionId: sectionId });
		},
	}));
