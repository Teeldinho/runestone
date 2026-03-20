import dagre from "@dagrejs/dagre";

const DEFAULT_NODE_WIDTH = 240;
const DEFAULT_NODE_HEIGHT = 100;
const DEFAULT_NODE_SEPARATION = 70;
const DEFAULT_RANK_SEPARATION = 110;

type LayoutDirection = "TB" | "BT" | "LR" | "RL";

type LayoutNodeInput = {
	id: string;
	width?: number;
	height?: number;
};

type LayoutEdgeInput = {
	source: string;
	target: string;
};

type GraphLayoutInput = {
	nodes: LayoutNodeInput[];
	edges: LayoutEdgeInput[];
	direction?: LayoutDirection;
	nodeSeparation?: number;
	rankSeparation?: number;
};

type PositionedLayoutNode = {
	id: string;
	position: {
		x: number;
		y: number;
	};
};

type GraphLayoutOutput = {
	nodes: PositionedLayoutNode[];
	edges: LayoutEdgeInput[];
};

export function getGraphLayout(input: GraphLayoutInput): GraphLayoutOutput {
	const graph = new dagre.graphlib.Graph();

	graph.setGraph({
		rankdir: input.direction ?? "TB",
		nodesep: input.nodeSeparation ?? DEFAULT_NODE_SEPARATION,
		ranksep: input.rankSeparation ?? DEFAULT_RANK_SEPARATION,
	});
	graph.setDefaultEdgeLabel(() => ({}));

	for (const node of input.nodes) {
		graph.setNode(node.id, {
			width: node.width ?? DEFAULT_NODE_WIDTH,
			height: node.height ?? DEFAULT_NODE_HEIGHT,
		});
	}

	for (const edge of input.edges) {
		graph.setEdge(edge.source, edge.target);
	}

	dagre.layout(graph);

	const nodes = input.nodes.map((node) => {
		const positionedNode = graph.node(node.id);

		return {
			id: node.id,
			position: {
				x: positionedNode?.x ?? 0,
				y: positionedNode?.y ?? 0,
			},
		};
	});

	return {
		nodes,
		edges: input.edges,
	};
}

export type { GraphLayoutInput, GraphLayoutOutput, LayoutEdgeInput, LayoutNodeInput, PositionedLayoutNode };
