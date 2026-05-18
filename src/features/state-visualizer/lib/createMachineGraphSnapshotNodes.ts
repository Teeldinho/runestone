import type { AnyStateMachine } from "xstate";
import { toDirectedGraph } from "xstate/graph";
import { STATE_VISUALIZER_NODE_KINDS } from "../config";
import type {
	MachineGraphNode,
	MachineGraphNodeKind,
	StateVisualizerSectionId,
} from "../model/types";
import { getMachineGraphNodeLabel } from "./machineGraphSelectors";

type DirectedGraphNodeInput = {
	id: string;
	children: DirectedGraphNodeInput[];
	edges: unknown[];
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

type CreateMachineGraphNodesInput = {
	machine: AnyStateMachine;
	sectionId: StateVisualizerSectionId;
	activeStateNodeIds: Set<string>;
};

const collectNodes = (
	node: DirectedGraphNodeInput,
): DirectedGraphNodeInput[] => {
	const childNodes = node.children.flatMap(collectNodes);

	return [...node.children, ...childNodes];
};

const getNodePathSegments = (
	machine: AnyStateMachine,
	nodeId: string,
): string[] => {
	if (nodeId === machine.id) {
		return [];
	}

	return nodeId.replace(`${machine.id}.`, "").split(".").filter(Boolean);
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

export const resolveMachineGraphNodeKind = (
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
			? `${machine.id}.${segments.slice(0, -1).join(".")}`
			: machine.id;
	const parentConfig = resolveStateConfig(machine, parentNodeId);

	if (parentConfig?.initial === currentKey) {
		return STATE_VISUALIZER_NODE_KINDS.INITIAL;
	}

	return STATE_VISUALIZER_NODE_KINDS.STATE;
};

export const createMachineGraphNodes = ({
	machine,
	sectionId,
	activeStateNodeIds,
}: CreateMachineGraphNodesInput): MachineGraphNode[] => {
	const directedGraph = toDirectedGraph(machine) as DirectedGraphNodeInput;
	const machineNodes = collectNodes(directedGraph).filter(
		(machineNode) => machineNode.children.length === 0,
	);

	return machineNodes.map((machineNode) => ({
		id: machineNode.id,
		label: getMachineGraphNodeLabel(sectionId, machineNode.stateNode.key),
		kind: resolveMachineGraphNodeKind(machine, machineNode.id),
		isActive: activeStateNodeIds.has(machineNode.id),
	}));
};
