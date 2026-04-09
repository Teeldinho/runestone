import type { AnyStateMachine } from "xstate";
import { toDirectedGraph } from "xstate/graph";
import {
	STATE_VISUALIZER_GRAPH_SYNTAX,
	STATE_VISUALIZER_NODE_KINDS,
} from "../config";
import type {
	MachineGraphEdge,
	MachineGraphNode,
	MachineGraphNodeKind,
	StateVisualizerSectionId,
} from "../model/types";
import { getMachineGraphNodeLabel } from "./machineGraphSelectors";

type MachineGraphSnapshot = {
	nodes: MachineGraphNode[];
	edges: MachineGraphEdge[];
	guardKeys: string[];
};

type CreateMachineGraphSnapshotInput = {
	machine: AnyStateMachine;
	sectionId: StateVisualizerSectionId;
	activeStateNodeIds: Set<string>;
};

type DirectedGraphNodeInput = {
	id: string;
	children: DirectedGraphNodeInput[];
	edges: DirectedGraphEdgeInput[];
	stateNode: {
		id: string;
		key: string;
		type?: string;
		initial?: unknown;
		parent?: {
			id: string;
			initial?: unknown;
		};
	};
};

type DirectedGraphEdgeInput = {
	source: {
		id: string;
	};
	target: {
		id: string;
	};
	label: {
		text: string;
	};
	transition: {
		eventType: string;
		guard?: unknown;
	};
};

const isLeafNode = (node: DirectedGraphNodeInput): boolean =>
	node.children.length === 0;

const getNodePathSegments = (
	machine: AnyStateMachine,
	nodeId: string,
): string[] => {
	if (nodeId === machine.id) {
		return [];
	}

	return nodeId
		.replace(
			`${machine.id}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}`,
			"",
		)
		.split(STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR);
};

const resolveStateConfig = (
	machine: AnyStateMachine,
	nodeId: string,
): Record<string, unknown> | null => {
	const stateSegments = getNodePathSegments(machine, nodeId);
	let currentConfig = machine.config as Record<string, unknown>;

	for (const segment of stateSegments) {
		const states = currentConfig.states as Record<
			string,
			Record<string, unknown>
		>;

		if (!states?.[segment]) {
			return null;
		}

		currentConfig = states[segment];
	}

	return currentConfig;
};

const getMachineGraphNodeKind = (
	machine: AnyStateMachine,
	nodeId: string,
): MachineGraphNodeKind => {
	const stateConfig = resolveStateConfig(machine, nodeId);

	if (stateConfig?.type === STATE_VISUALIZER_NODE_KINDS.FINAL) {
		return STATE_VISUALIZER_NODE_KINDS.FINAL;
	}

	const segments = getNodePathSegments(machine, nodeId);
	const currentKey = segments.at(-1);

	if (!currentKey) {
		return STATE_VISUALIZER_NODE_KINDS.STATE;
	}

	if (segments.length === 1 && machine.config.initial === currentKey) {
		return STATE_VISUALIZER_NODE_KINDS.INITIAL;
	}

	const parentNodeId =
		segments.length > 1
			? `${machine.id}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}${segments.slice(0, -1).join(STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR)}`
			: machine.id;
	const parentConfig = resolveStateConfig(machine, parentNodeId);

	if (parentConfig?.initial === currentKey) {
		return STATE_VISUALIZER_NODE_KINDS.INITIAL;
	}

	return STATE_VISUALIZER_NODE_KINDS.STATE;
};

const collectNodes = (
	node: DirectedGraphNodeInput,
): DirectedGraphNodeInput[] => {
	const childNodes = node.children.flatMap(collectNodes);
	return [...node.children, ...childNodes];
};

const collectEdges = (
	node: DirectedGraphNodeInput,
): DirectedGraphEdgeInput[] => {
	const childEdges = node.children.flatMap(collectEdges);
	return [...node.edges, ...childEdges];
};

const collectGuardKeys = (guard: unknown): string[] => {
	if (!guard) {
		return [];
	}

	if (typeof guard === "string") {
		return [guard];
	}

	if (typeof guard !== "object" && typeof guard !== "function") {
		return [];
	}

	const guardRecord = guard as {
		type?: unknown;
		guard?: unknown;
		guards?: unknown;
	};

	const nestedGuards = [
		...(Array.isArray(guardRecord.guards) ? guardRecord.guards : []),
		...(guardRecord.guard ? [guardRecord.guard] : []),
	];

	const nestedGuardKeys = nestedGuards.flatMap(collectGuardKeys);
	const guardType =
		typeof guardRecord.type === "string" ? guardRecord.type : null;
	const guardKeys =
		guardType &&
		!guardType.startsWith(STATE_VISUALIZER_GRAPH_SYNTAX.MACHINE_GUARD_PREFIX)
			? [guardType, ...nestedGuardKeys]
			: nestedGuardKeys;

	return [...new Set(guardKeys)];
};

const normalizeTransitions = (
	transitionConfig: unknown,
): Array<Record<string, unknown>> => {
	if (!transitionConfig) {
		return [];
	}

	if (typeof transitionConfig === "string") {
		return [{ target: transitionConfig }];
	}

	if (Array.isArray(transitionConfig)) {
		return transitionConfig.filter(
			(candidate): candidate is Record<string, unknown> =>
				typeof candidate === "object" && candidate !== null,
		);
	}

	if (typeof transitionConfig === "object") {
		return [transitionConfig as Record<string, unknown>];
	}

	return [];
};

const resolveTargetNodeId = (
	machine: AnyStateMachine,
	sourceNodeId: string,
	rawTarget: string,
): string => {
	if (rawTarget.startsWith(STATE_VISUALIZER_GRAPH_SYNTAX.TARGET_ID_PREFIX)) {
		return rawTarget.slice(
			STATE_VISUALIZER_GRAPH_SYNTAX.TARGET_ID_PREFIX.length,
		);
	}

	if (
		rawTarget.startsWith(STATE_VISUALIZER_GRAPH_SYNTAX.RELATIVE_TARGET_PREFIX)
	) {
		return `${machine.id}${rawTarget}`;
	}

	const machinePathPrefix = `${machine.id}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}`;

	if (rawTarget.startsWith(machinePathPrefix)) {
		return rawTarget;
	}

	const sourceSegments = getNodePathSegments(machine, sourceNodeId);
	const parentSegments = sourceSegments.slice(0, -1);

	if (parentSegments.length === 0) {
		return `${machine.id}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}${rawTarget}`;
	}

	return `${machine.id}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}${parentSegments.join(STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR)}${STATE_VISUALIZER_GRAPH_SYNTAX.NODE_PATH_SEPARATOR}${rawTarget}`;
};

const getGuardFromMachineConfig = (
	machine: AnyStateMachine,
	edge: DirectedGraphEdgeInput,
): string | null => {
	const sourceConfig = resolveStateConfig(machine, edge.source.id);
	const sourceTransitions = normalizeTransitions(
		sourceConfig?.on
			? (sourceConfig.on as Record<string, unknown>)[edge.transition.eventType]
			: undefined,
	);
	const rootTransitions = normalizeTransitions(
		machine.config.on
			? (machine.config.on as Record<string, unknown>)[
					edge.transition.eventType
				]
			: undefined,
	);

	for (const transitionConfig of [...sourceTransitions, ...rootTransitions]) {
		const rawTarget = transitionConfig.target;
		const targetValues = Array.isArray(rawTarget) ? rawTarget : [rawTarget];

		for (const targetValue of targetValues) {
			if (typeof targetValue !== "string") {
				continue;
			}

			const resolvedTarget = resolveTargetNodeId(
				machine,
				edge.source.id,
				targetValue,
			);

			if (resolvedTarget !== edge.target.id) {
				continue;
			}

			const guardKeys = collectGuardKeys(transitionConfig.guard);

			if (guardKeys.length === 0) {
				return null;
			}

			return guardKeys.join(STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_DELIMITER);
		}
	}

	return null;
};

const getEdgeGuardLabel = (
	machine: AnyStateMachine,
	edge: DirectedGraphEdgeInput,
): string | null => {
	const guardKeys = collectGuardKeys(edge.transition.guard);

	if (guardKeys.length > 0) {
		return guardKeys.join(STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_DELIMITER);
	}

	const machineConfigGuard = getGuardFromMachineConfig(machine, edge);

	if (machineConfigGuard) {
		return machineConfigGuard;
	}

	const labelMatch = edge.label.text.match(
		STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_LABEL_CAPTURE_PATTERN,
	);

	if (!labelMatch) {
		return null;
	}

	const labelGuardKeys = labelMatch[1]
		.split(STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_TOKEN_SPLIT_PATTERN)
		.map((guardKey) => guardKey.trim())
		.filter(Boolean);

	if (labelGuardKeys.length === 0) {
		return null;
	}

	return [...new Set(labelGuardKeys)].join(
		STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_DELIMITER,
	);
};

const toMachineGraphEdge = (
	machine: AnyStateMachine,
	edge: DirectedGraphEdgeInput,
	index: number,
): MachineGraphEdge => {
	const guard = getEdgeGuardLabel(machine, edge);

	return {
		id: [
			edge.source.id,
			edge.target.id,
			edge.transition.eventType,
			guard ?? STATE_VISUALIZER_GRAPH_SYNTAX.UNGUARDED_EDGE_TOKEN,
			String(index),
		].join(STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR),
		source: edge.source.id,
		target: edge.target.id,
		eventType: edge.transition.eventType,
		guard,
	};
};

export const createMachineGraphSnapshot = ({
	machine,
	sectionId,
	activeStateNodeIds,
}: CreateMachineGraphSnapshotInput): MachineGraphSnapshot => {
	const directedGraph = toDirectedGraph(machine) as DirectedGraphNodeInput;
	const machineNodes = collectNodes(directedGraph);
	const machineNodeIds = new Set(
		machineNodes.map((machineNode) => machineNode.id),
	);
	const topLevelLeafNodeIds = machineNodes
		.filter(
			(machineNode) =>
				machineNode.stateNode.parent?.id === machine.id &&
				isLeafNode(machineNode),
		)
		.map((machineNode) => machineNode.id);

	const rawEdges = collectEdges(directedGraph);
	const scopedEdges = rawEdges.filter(
		(edge) =>
			machineNodeIds.has(edge.source.id) && machineNodeIds.has(edge.target.id),
	);
	const rootEdges = rawEdges.filter(
		(edge) =>
			edge.source.id === machine.id && machineNodeIds.has(edge.target.id),
	);
	const fallbackRootEdges =
		scopedEdges.length > 0
			? []
			: rootEdges.flatMap((rootEdge) =>
					topLevelLeafNodeIds.map((sourceNodeId) => ({
						...rootEdge,
						source: { id: sourceNodeId },
					})),
				);
	const edges = [...scopedEdges, ...fallbackRootEdges].map((edge, index) =>
		toMachineGraphEdge(machine, edge, index),
	);
	const guardKeys = [
		...new Set(
			edges.flatMap((edge) =>
				edge.guard
					? edge.guard.split(STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_DELIMITER)
					: [],
			),
		),
	];

	return {
		nodes: machineNodes.map((machineNode) => ({
			id: machineNode.id,
			label: getMachineGraphNodeLabel(sectionId, machineNode.stateNode.key),
			kind: getMachineGraphNodeKind(machine, machineNode.id),
			isActive: activeStateNodeIds.has(machineNode.id),
		})),
		edges,
		guardKeys,
	};
};

export type { MachineGraphSnapshot };
