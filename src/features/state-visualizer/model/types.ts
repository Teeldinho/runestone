export type MachineGraphNodeKind = "state" | "initial" | "final";

export type StateVisualizerSectionId =
	| "dungeon"
	| "camera"
	| "audio"
	| "player";

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
