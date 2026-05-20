import type { AnyStateMachine } from "xstate";
import { STATE_VISUALIZER_GRAPH_SYNTAX } from "../config";
import type {
	MachineGraphEdge,
	MachineGraphNode,
	StateVisualizerSectionId,
} from "../model/types";
import { createMachineGraphEdges } from "./createMachineGraphSnapshotEdges";
import { createMachineGraphNodes } from "./createMachineGraphSnapshotNodes";

type CreateMachineGraphSnapshotInput = {
	machine: AnyStateMachine;
	sectionId: StateVisualizerSectionId;
	activeStateNodeIds: Set<string>;
};

type MachineGraphSnapshot = {
	nodes: MachineGraphNode[];
	edges: MachineGraphEdge[];
	guardKeys: string[];
};

export const createMachineGraphSnapshot = ({
	machine,
	sectionId,
	activeStateNodeIds,
}: CreateMachineGraphSnapshotInput): MachineGraphSnapshot => {
	const nodes = createMachineGraphNodes({
		machine,
		sectionId,
		activeStateNodeIds,
	});
	const visibleNodeIds = new Set(nodes.map((node) => node.id));
	const { edges } = createMachineGraphEdges({ machine });
	const visibleEdges = edges.filter(
		(edge) =>
			visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
	);
	const visibleGuardKeys = [
		...new Set(
			visibleEdges.flatMap((edge) =>
				edge.guard
					? edge.guard.split(STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_DELIMITER)
					: [],
			),
		),
	];

	return {
		nodes,
		edges: visibleEdges,
		guardKeys: visibleGuardKeys,
	};
};

export type { MachineGraphSnapshot };
