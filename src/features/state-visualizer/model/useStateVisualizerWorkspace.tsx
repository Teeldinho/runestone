import { type ReactNode, useMemo, useState } from "react";
import { useStore } from "zustand";

import { STATE_VISUALIZER_DEFAULT_OPEN_SECTION } from "../config";
import {
	selectStateVisualizerWorkspaceHandleSelectedSectionIdChange,
	selectStateVisualizerWorkspaceSelectedSectionId,
} from "../lib";
import {
	type StateVisualizerWorkspaceContextValue,
	stateVisualizerWorkspaceContext,
	useRequiredStateVisualizerWorkspaceStore,
} from "./stateVisualizerWorkspaceContext";
import { createStateVisualizerWorkspaceStore } from "./stateVisualizerWorkspaceStore";
import type { StateVisualizerSectionId } from "./types";

type StateVisualizerWorkspaceProviderProps = {
	children: ReactNode;
	defaultSectionId?: StateVisualizerSectionId;
};

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
		selectStateVisualizerWorkspaceSelectedSectionId,
	);
	const handleSelectedSectionIdChange = useStore(
		stateVisualizerWorkspaceStore,
		selectStateVisualizerWorkspaceHandleSelectedSectionIdChange,
	);

	return useMemo(
		() => ({ selectedSectionId, handleSelectedSectionIdChange }),
		[handleSelectedSectionIdChange, selectedSectionId],
	);
};

export type {
	StateVisualizerWorkspaceContextValue,
	StateVisualizerWorkspaceProviderProps,
};
