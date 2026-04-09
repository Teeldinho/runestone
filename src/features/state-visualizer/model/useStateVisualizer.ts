import { useMemo } from "react";
import type { AnyStateMachine } from "xstate";
import { getGraphLayout } from "@/shared/lib";

import {
	MACHINE_GRAPH_LAYOUT,
	STATE_VISUALIZER_DETAILS_COPY,
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_SECTIONS,
} from "../config";
import { createMachineGraphSnapshot } from "../lib/createMachineGraphSnapshot";
import { formatMachineStateLabel } from "../lib/machineGraphSelectors";
import type {
	MachineGraphSection,
	PositionedMachineGraphNode,
	StateVisualizerSectionId,
} from "./types";

type UseStateVisualizerInput = {
	machinesBySectionId: Record<StateVisualizerSectionId, AnyStateMachine>;
	stateValuesBySectionId: Record<StateVisualizerSectionId, unknown>;
};

type StateVisualizerResult = {
	sections: MachineGraphSection[];
};

const collectStatePaths = (stateValue: unknown, prefix = ""): string[] => {
	if (typeof stateValue === "string") {
		return [
			prefix
				? `${prefix}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}${stateValue}`
				: stateValue,
		];
	}

	if (!stateValue || typeof stateValue !== "object") {
		return [];
	}

	const entries = Object.entries(stateValue as Record<string, unknown>);

	return entries.flatMap(([key, nestedStateValue]) =>
		collectStatePaths(
			nestedStateValue,
			prefix
				? `${prefix}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}${key}`
				: key,
		),
	);
};

const createActiveStateNodeIds = (
	machine: AnyStateMachine,
	stateValue: unknown,
): Set<string> => {
	return new Set(
		collectStatePaths(stateValue).map(
			(statePath) =>
				`${machine.id}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}${statePath}`,
		),
	);
};

const formatActiveStateLabel = (stateValue: unknown): string => {
	const statePaths = collectStatePaths(stateValue);

	if (statePaths.length === 0) {
		return STATE_VISUALIZER_DETAILS_COPY.UNKNOWN_STATE_LABEL;
	}

	return statePaths
		.map(formatMachineStateLabel)
		.join(STATE_VISUALIZER_GRAPH_SYNTAX.STATE_PATH_DELIMITER);
};

export const useStateVisualizer = ({
	machinesBySectionId,
	stateValuesBySectionId,
}: UseStateVisualizerInput): StateVisualizerResult => {
	const sections = useMemo<MachineGraphSection[]>(() => {
		return STATE_VISUALIZER_SECTIONS.map((section) => {
			const machine = machinesBySectionId[section.id];
			const stateValue = stateValuesBySectionId[section.id];
			const graphSnapshot = createMachineGraphSnapshot({
				machine,
				sectionId: section.id,
				activeStateNodeIds: createActiveStateNodeIds(machine, stateValue),
			});
			const layout = getGraphLayout({
				nodes: graphSnapshot.nodes.map((node) => ({
					id: node.id,
					width: MACHINE_GRAPH_LAYOUT.NODE_WIDTH,
					height: MACHINE_GRAPH_LAYOUT.NODE_HEIGHT,
				})),
				edges: graphSnapshot.edges.map((edge) => ({
					source: edge.source,
					target: edge.target,
				})),
				direction: MACHINE_GRAPH_LAYOUT.DIRECTION,
				nodeSeparation: MACHINE_GRAPH_LAYOUT.NODE_SEPARATION,
				rankSeparation: MACHINE_GRAPH_LAYOUT.RANK_SEPARATION,
			});
			const positionByNodeId = new Map(
				layout.nodes.map((node) => [node.id, node.position]),
			);
			const positionedNodes =
				graphSnapshot.nodes.map<PositionedMachineGraphNode>((node) => ({
					...node,
					position: positionByNodeId.get(node.id) ?? { x: 0, y: 0 },
				}));

			return {
				id: section.id,
				label: section.label,
				activeStateLabel: formatActiveStateLabel(stateValue),
				guardKeys: graphSnapshot.guardKeys,
				nodes: graphSnapshot.nodes,
				edges: graphSnapshot.edges,
				positionedNodes,
			};
		});
	}, [machinesBySectionId, stateValuesBySectionId]);

	return {
		sections,
	};
};

export type { StateVisualizerResult, UseStateVisualizerInput };
