import type { CSSProperties } from "react";

import {
	getMachineGraphGuardLabel,
	getMachineGraphTransitionEventLabel,
	type MachineGraphSection,
	STATE_VISUALIZER_DETAILS_COPY,
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_SECTION_DESCRIPTIONS,
	type StateVisualizerSectionId,
} from "@/features/state-visualizer";

import {
	INSPECTOR_COPY,
	INSPECTOR_GUARD_LEGEND_LAYOUT,
	INSPECTOR_ID_SEGMENT_SEPARATOR,
	INSPECTOR_ID_SEGMENTS,
} from "../config";
import { createGuardColorByKey } from "./guardMarkerPalette";
import {
	type InspectorFlowEdge,
	type InspectorFlowNode,
	mapGraphEdgesToFlowEdges,
	mapGraphNodesToFlowNodes,
} from "./reactFlowGraphMappers";

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
	legendDotStyles: CSSProperties;
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
	transitionDetails: InspectorTransitionDetail[];
	flowEdges: InspectorFlowEdge[];
	flowNodes: InspectorFlowNode[];
	graphEdges: MachineGraphSection["edges"];
	graphNodes: MachineGraphSection["positionedNodes"];
	stateDetails: InspectorStateDetail[];
	hasGuardIndicators: boolean;
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

export const createInspectorMachineSectionViewModel = (
	section: MachineGraphSection,
): InspectorMachineSectionViewModel => {
	const guardColorByKey = createGuardColorByKey(section.guardKeys);

	return {
		id: section.id,
		label: section.label,
		activeStateLabel: section.activeStateLabel,
		activeStateSummary: `${STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_SUMMARY_PREFIX} ${section.activeStateLabel}`,
		sectionDescription: STATE_VISUALIZER_SECTION_DESCRIPTIONS[section.id],
		guardDetails: section.guardKeys.map((guardKey) => ({
			id: [section.id, guardKey].join(INSPECTOR_ID_SEGMENT_SEPARATOR),
			label: getMachineGraphGuardLabel(guardKey),
		})),
		guardIndicators: section.guardKeys.map((guardKey) => {
			const transitionCount = section.edges.filter((edge) =>
				splitGuardKeys(edge.guard).includes(guardKey),
			).length;

			return {
				id: [section.id, INSPECTOR_ID_SEGMENTS.INDICATOR, guardKey].join(
					INSPECTOR_ID_SEGMENT_SEPARATOR,
				),
				label: getMachineGraphGuardLabel(guardKey),
				color: guardColorByKey[guardKey],
				transitionCount,
				transitionCountLabel:
					transitionCount === 1
						? INSPECTOR_COPY.TRANSITION_LABEL_SINGULAR
						: INSPECTOR_COPY.TRANSITION_LABEL_PLURAL,
				legendDotStyles: {
					width: `${INSPECTOR_GUARD_LEGEND_LAYOUT.DOT_SIZE_PX}px`,
					height: `${INSPECTOR_GUARD_LEGEND_LAYOUT.DOT_SIZE_PX}px`,
					backgroundColor: guardColorByKey[guardKey],
				},
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
			const sourceLabel = resolveSectionEdgeNodeLabel(section, edge.source);
			const targetLabel = resolveSectionEdgeNodeLabel(section, edge.target);
			const eventLabel = getMachineGraphTransitionEventLabel(edge.eventType);
			const requirementLabel = edge.guard
				? getMachineGraphGuardLabel(edge.guard)
				: STATE_VISUALIZER_DETAILS_COPY.TRANSITION_REQUIREMENT_NONE;

			return {
				id: edge.id,
				eventLabel,
				flowLabel: `${sourceLabel}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_FLOW_SEPARATOR}${targetLabel}`,
				requirementLabel,
				summary: `${eventLabel} ${INSPECTOR_COPY.TRANSITION_SUMMARY_MOVES_FROM} ${sourceLabel} ${INSPECTOR_COPY.TRANSITION_SUMMARY_TO} ${targetLabel}. ${STATE_VISUALIZER_DETAILS_COPY.TRANSITION_REQUIREMENT_PREFIX} ${requirementLabel}.`,
			};
		}),
		flowEdges: mapGraphEdgesToFlowEdges(section.edges, section.positionedNodes),
		flowNodes: mapGraphNodesToFlowNodes(section.positionedNodes),
		hasGuardIndicators: section.guardKeys.length > 0,
	};
};

export type {
	InspectorGuardDetail,
	InspectorGuardIndicator,
	InspectorMachineSectionViewModel,
	InspectorStateDetail,
	InspectorTransitionDetail,
};
