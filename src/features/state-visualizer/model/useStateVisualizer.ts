import { useMemo } from "react";
import type { AnyStateMachine } from "xstate";

import { useResponsiveLayout } from "@/shared/lib";

import { createStateVisualizerSections } from "../lib/stateVisualizerSections";
import type { MachineGraphSection, StateVisualizerSectionId } from "./types";

type UseStateVisualizerInput = {
	machinesBySectionId: Record<StateVisualizerSectionId, AnyStateMachine>;
	stateValuesBySectionId: Record<StateVisualizerSectionId, unknown>;
};

type StateVisualizerResult = {
	sections: MachineGraphSection[];
};

export const useStateVisualizer = ({
	machinesBySectionId,
	stateValuesBySectionId,
}: UseStateVisualizerInput): StateVisualizerResult => {
	const { isDesktopLayout } = useResponsiveLayout();

	const sections = useMemo<MachineGraphSection[]>(() => {
		return createStateVisualizerSections({
			machinesBySectionId,
			stateValuesBySectionId,
			isDesktopLayout,
		});
	}, [isDesktopLayout, machinesBySectionId, stateValuesBySectionId]);

	return {
		sections,
	};
};

export type { StateVisualizerResult, UseStateVisualizerInput };
