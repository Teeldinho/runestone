import type { AnyStateMachine } from "xstate";
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
	const { edges, guardKeys } = createMachineGraphEdges({ machine });

	return {
		nodes,
		edges,
		guardKeys,
	};
};

export type { MachineGraphSnapshot };
