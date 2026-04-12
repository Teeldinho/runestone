import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import {
	STATE_VISUALIZER_DEFAULT_OPEN_SECTION,
	STATE_VISUALIZER_ERROR_MESSAGES,
} from "../config";
import type { StateVisualizerSectionId } from "./types";

type StateVisualizerWorkspaceContextValue = {
	selectedSectionId: StateVisualizerSectionId;
	handleSelectedSectionIdChange: (sectionId: StateVisualizerSectionId) => void;
};

type StateVisualizerWorkspaceProviderProps = {
	children: ReactNode;
	defaultSectionId?: StateVisualizerSectionId;
};

const stateVisualizerWorkspaceContext =
	createContext<StateVisualizerWorkspaceContextValue | null>(null);

export const StateVisualizerWorkspaceProvider = ({
	children,
	defaultSectionId = STATE_VISUALIZER_DEFAULT_OPEN_SECTION,
}: StateVisualizerWorkspaceProviderProps) => {
	const [selectedSectionId, setSelectedSectionId] = useState(defaultSectionId);

	const handleSelectedSectionIdChange = useCallback(
		(sectionId: StateVisualizerSectionId) => {
			setSelectedSectionId(sectionId);
		},
		[],
	);

	const value = useMemo(
		() => ({
			selectedSectionId,
			handleSelectedSectionIdChange,
		}),
		[selectedSectionId, handleSelectedSectionIdChange],
	);

	return (
		<stateVisualizerWorkspaceContext.Provider value={value}>
			{children}
		</stateVisualizerWorkspaceContext.Provider>
	);
};

export const useStateVisualizerWorkspace = () => {
	const context = useContext(stateVisualizerWorkspaceContext);

	if (!context) {
		throw new Error(
			STATE_VISUALIZER_ERROR_MESSAGES.WORKSPACE_PROVIDER_REQUIRED,
		);
	}

	return context;
};

export type {
	StateVisualizerWorkspaceContextValue,
	StateVisualizerWorkspaceProviderProps,
};
