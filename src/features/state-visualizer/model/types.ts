import type { STATE_VISUALIZER_SECTION_IDS } from "../config/machineGraph";

export type MachineGraphNodeKind = "state" | "initial" | "final";

export type StateVisualizerSectionId =
	(typeof STATE_VISUALIZER_SECTION_IDS)[keyof typeof STATE_VISUALIZER_SECTION_IDS];

export type MachineGraphNode = {
	id: string;
	label: string;
	kind: MachineGraphNodeKind;
	isActive: boolean;
};

export type MachineGraphEdge = {
	id: string;
	source: string;
	target: string;
	eventType: string;
	guard: string | null;
};

export type MachineGraphNodePosition = {
	x: number;
	y: number;
};

export type PositionedMachineGraphNode = MachineGraphNode & {
	position: MachineGraphNodePosition;
};

export type MachineGraphSection = {
	id: StateVisualizerSectionId;
	label: string;
	activeStateLabel: string;
	guardKeys: string[];
	nodes: MachineGraphNode[];
	edges: MachineGraphEdge[];
	positionedNodes: PositionedMachineGraphNode[];
};
