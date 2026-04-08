import { useMemo } from "react";

import type {
	MachineGraphSection,
	StateVisualizerSectionId,
} from "@/features/state-visualizer";

import { INSPECTOR_REACT_FLOW_DEFAULTS } from "../config";
import {
	type InspectorFlowEdge,
	type InspectorFlowNode,
	mapGraphEdgesToFlowEdges,
	mapGraphNodesToFlowNodes,
} from "../lib";

type UseXStateInspectorPanelInput = {
	activeStateLabel: string;
	sections: MachineGraphSection[];
};

type InspectorMachineSectionViewModel = {
	id: StateVisualizerSectionId;
	label: string;
	activeStateLabel: string;
	guardKeys: string[];
	graphEdges: MachineGraphSection["edges"];
	graphNodes: MachineGraphSection["positionedNodes"];
	flowEdges: InspectorFlowEdge[];
	flowNodes: InspectorFlowNode[];
};

type XStateInspectorPanelViewModel = {
	activeStateLabel: string;
	sections: InspectorMachineSectionViewModel[];
	reactFlowDefaults: typeof INSPECTOR_REACT_FLOW_DEFAULTS;
};

export const useXStateInspectorPanel = ({
	activeStateLabel,
	sections,
}: UseXStateInspectorPanelInput): XStateInspectorPanelViewModel => {
	const sectionViewModels = useMemo<InspectorMachineSectionViewModel[]>(
		() =>
			sections.map((section) => ({
				id: section.id,
				label: section.label,
				activeStateLabel: section.activeStateLabel,
				guardKeys: section.guardKeys,
				graphEdges: section.edges,
				graphNodes: section.positionedNodes,
				flowEdges: mapGraphEdgesToFlowEdges(section.edges),
				flowNodes: mapGraphNodesToFlowNodes(section.positionedNodes),
			})),
		[sections],
	);

	return {
		activeStateLabel,
		sections: sectionViewModels,
		reactFlowDefaults: INSPECTOR_REACT_FLOW_DEFAULTS,
	};
};

export type {
	InspectorMachineSectionViewModel,
	UseXStateInspectorPanelInput,
	XStateInspectorPanelViewModel,
};
