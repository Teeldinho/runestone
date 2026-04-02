import dagre from "@dagrejs/dagre";
import { GRAPH_LAYOUT_DEFAULTS } from "@/shared/config";

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
		nodesep: input.nodeSeparation ?? GRAPH_LAYOUT_DEFAULTS.NODE_SEPARATION,
		ranksep: input.rankSeparation ?? GRAPH_LAYOUT_DEFAULTS.RANK_SEPARATION,
	});
	graph.setDefaultEdgeLabel(() => ({}));

	for (const node of input.nodes) {
		graph.setNode(node.id, {
			width: node.width ?? GRAPH_LAYOUT_DEFAULTS.NODE_WIDTH,
			height: node.height ?? GRAPH_LAYOUT_DEFAULTS.NODE_HEIGHT,
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

export type {
	GraphLayoutInput,
	GraphLayoutOutput,
	LayoutEdgeInput,
	LayoutNodeInput,
	PositionedLayoutNode,
};
