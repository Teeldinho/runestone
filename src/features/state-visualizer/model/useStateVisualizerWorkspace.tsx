import {
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

import {
	STATE_VISUALIZER_DEFAULT_OPEN_SECTION,
	STATE_VISUALIZER_ERROR_MESSAGES,
} from "../config";
import type { StateVisualizerSectionId } from "./types";

type StateVisualizerWorkspaceContextValue = {
	selectedSectionId: StateVisualizerSectionId;
	handleSelectedSectionIdChange: (sectionId: StateVisualizerSectionId) => void;
};

type StateVisualizerWorkspaceStoreState = {
	selectedSectionId: StateVisualizerSectionId;
	handleSelectedSectionIdChange: (sectionId: StateVisualizerSectionId) => void;
};

type StateVisualizerWorkspaceProviderProps = {
	children: ReactNode;
	defaultSectionId?: StateVisualizerSectionId;
};

type StateVisualizerWorkspaceStore =
	StoreApi<StateVisualizerWorkspaceStoreState>;

const createStateVisualizerWorkspaceStore = (
	defaultSectionId: StateVisualizerSectionId,
): StateVisualizerWorkspaceStore =>
	createStore<StateVisualizerWorkspaceStoreState>()((set) => ({
		selectedSectionId: defaultSectionId,
		handleSelectedSectionIdChange: (sectionId) => {
			set({ selectedSectionId: sectionId });
		},
	}));

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

const selectSelectedSectionId = (
	state: StateVisualizerWorkspaceStoreState,
): StateVisualizerSectionId => state.selectedSectionId;

const selectHandleSelectedSectionIdChange = (
	state: StateVisualizerWorkspaceStoreState,
): ((sectionId: StateVisualizerSectionId) => void) =>
	state.handleSelectedSectionIdChange;

export const StateVisualizerWorkspaceProvider = ({
	children,
	defaultSectionId = STATE_VISUALIZER_DEFAULT_OPEN_SECTION,
}: StateVisualizerWorkspaceProviderProps) => {
	const [stateVisualizerWorkspaceStore] = useState(() =>
		createStateVisualizerWorkspaceStore(defaultSectionId),
	);

	return (
		<stateVisualizerWorkspaceContext.Provider
			value={stateVisualizerWorkspaceStore}
		>
			{children}
		</stateVisualizerWorkspaceContext.Provider>
	);
};

export const useStateVisualizerWorkspace = () => {
	const stateVisualizerWorkspaceStore =
		useRequiredStateVisualizerWorkspaceStore();
	const selectedSectionId = useStore(
		stateVisualizerWorkspaceStore,
		selectSelectedSectionId,
	);
	const handleSelectedSectionIdChange = useStore(
		stateVisualizerWorkspaceStore,
		selectHandleSelectedSectionIdChange,
	);

	return useMemo(
		() => ({ selectedSectionId, handleSelectedSectionIdChange }),
		[handleSelectedSectionIdChange, selectedSectionId],
	);
};

export type {
	StateVisualizerWorkspaceContextValue,
	StateVisualizerWorkspaceProviderProps,
	StateVisualizerWorkspaceStore,
	StateVisualizerWorkspaceStoreState,
};
