import { useCallback, useEffect, useMemo } from "react";

import {
	getMachineGraphGuardLabel,
	getMachineGraphTransitionEventLabel,
	type MachineGraphSection,
	STATE_VISUALIZER_DETAILS_COPY,
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_SECTION_DESCRIPTIONS,
	STATE_VISUALIZER_SECTION_IDS,
	type StateVisualizerSectionId,
	useStateVisualizerWorkspace,
} from "@/features/state-visualizer";

import {
	INSPECTOR_COPY,
	INSPECTOR_REACT_FLOW_DEFAULTS,
	INSPECTOR_REACT_FLOW_SECTION_PADDING,
} from "../config";
import {
	createGuardColorByKey,
	type InspectorFlowEdge,
	type InspectorFlowNode,
	mapGraphEdgesToFlowEdges,
	mapGraphNodesToFlowNodes,
} from "../lib";

type UseXStateInspectorPanelInput = {
	sections: MachineGraphSection[];
};

type InspectorStateDetail = {
	id: string;
	label: string;
	isActive: boolean;
};

type InspectorGuardDetail = {
	id: string;
	label: string;
};

type InspectorGuardIndicator = {
	id: string;
	label: string;
	color: string;
	transitionCount: number;
	transitionCountLabel: string;
};

type InspectorTransitionDetail = {
	id: string;
	eventLabel: string;
	flowLabel: string;
	requirementLabel: string;
	summary: string;
};

type InspectorMachineSectionViewModel = {
	id: StateVisualizerSectionId;
	label: string;
	activeStateLabel: string;
	activeStateSummary: string;
	sectionDescription: string;
	guardDetails: InspectorGuardDetail[];
	guardIndicators: InspectorGuardIndicator[];
	graphEdges: MachineGraphSection["edges"];
	graphNodes: MachineGraphSection["positionedNodes"];
	stateDetails: InspectorStateDetail[];
	transitionDetails: InspectorTransitionDetail[];
	flowEdges: InspectorFlowEdge[];
	flowNodes: InspectorFlowNode[];
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
};

const resolveSectionEdgeNodeLabel = (
	section: MachineGraphSection,
	nodeId: string,
): string => {
	return (
		section.positionedNodes.find((node) => node.id === nodeId)?.label ?? nodeId
	);
};

const splitGuardKeys = (guard: string | null): string[] => {
	if (!guard) {
		return [];
	}

	return guard
		.split(STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_DELIMITER)
		.map((guardKey) => guardKey.trim())
		.filter(Boolean);
};

export const useXStateInspectorPanel = ({
	sections,
}: UseXStateInspectorPanelInput): XStateInspectorPanelViewModel => {
	const { selectedSectionId, handleSelectedSectionIdChange } =
		useStateVisualizerWorkspace();

	const sectionViewModels = useMemo<InspectorMachineSectionViewModel[]>(
		() =>
			sections.map((section) => {
				const guardColorByKey = createGuardColorByKey(section.guardKeys);

				return {
					id: section.id,
					label: section.label,
					activeStateLabel: section.activeStateLabel,
					activeStateSummary: `${STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_SUMMARY_PREFIX} ${section.activeStateLabel}`,
					sectionDescription: STATE_VISUALIZER_SECTION_DESCRIPTIONS[section.id],
					guardDetails: section.guardKeys.map((guardKey) => ({
						id: `${section.id}:${guardKey}`,
						label: getMachineGraphGuardLabel(guardKey),
					})),
					guardIndicators: section.guardKeys.map((guardKey) => {
						const transitionCount = section.edges.filter((edge) =>
							splitGuardKeys(edge.guard).includes(guardKey),
						).length;

						return {
							id: `${section.id}:indicator:${guardKey}`,
							label: getMachineGraphGuardLabel(guardKey),
							color: guardColorByKey[guardKey],
							transitionCount,
							transitionCountLabel:
								transitionCount === 1
									? INSPECTOR_COPY.TRANSITION_LABEL_SINGULAR
									: INSPECTOR_COPY.TRANSITION_LABEL_PLURAL,
						};
					}),
					graphEdges: section.edges,
					graphNodes: section.positionedNodes,
					stateDetails: section.positionedNodes.map((node) => ({
						id: node.id,
						label: node.label,
						isActive: node.isActive,
					})),
					transitionDetails: section.edges.map((edge) => {
						const sourceLabel = resolveSectionEdgeNodeLabel(
							section,
							edge.source,
						);
						const targetLabel = resolveSectionEdgeNodeLabel(
							section,
							edge.target,
						);
						const eventLabel = getMachineGraphTransitionEventLabel(
							edge.eventType,
						);
						const requirementLabel = edge.guard
							? getMachineGraphGuardLabel(edge.guard)
							: STATE_VISUALIZER_DETAILS_COPY.TRANSITION_REQUIREMENT_NONE;

						return {
							id: edge.id,
							eventLabel,
							flowLabel: `${sourceLabel}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_FLOW_SEPARATOR}${targetLabel}`,
							requirementLabel,
							summary: `${eventLabel} moves from ${sourceLabel} to ${targetLabel}. ${STATE_VISUALIZER_DETAILS_COPY.TRANSITION_REQUIREMENT_PREFIX} ${requirementLabel}.`,
						};
					}),
					flowEdges: mapGraphEdgesToFlowEdges(section.edges),
					flowNodes: mapGraphNodesToFlowNodes(section.positionedNodes),
				};
			}),
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

	return {
		sectionTabs: sectionViewModels.map((section) => ({
			id: section.id,
			label: section.label,
		})),
		selectedSectionId,
		handleSelectedSectionIdChange: handleSelectedSectionChange,
		selectedSection:
			sectionViewModels.find((section) => section.id === selectedSectionId) ??
			null,
		sections: sectionViewModels,
		reactFlowDefaults: INSPECTOR_REACT_FLOW_DEFAULTS,
		selectedFlowFitViewPadding:
			selectedSectionId === STATE_VISUALIZER_SECTION_IDS.CAMERA
				? INSPECTOR_REACT_FLOW_SECTION_PADDING.CAMERA
				: INSPECTOR_REACT_FLOW_DEFAULTS.FIT_VIEW_PADDING,
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
