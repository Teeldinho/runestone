import { useMemo } from "react";

import type { RoomId } from "@/entities/dungeon";
import { getGraphLayout } from "@/shared/lib";

import { MACHINE_GRAPH_LAYOUT } from "../config";
import {
	createMachineGraphSnapshot,
	type MachineGraphSnapshot,
} from "../lib/createMachineGraphSnapshot";
import type { PositionedMachineGraphNode } from "./types";

type UseStateVisualizerInput = {
	currentRoomId: RoomId;
};

type StateVisualizerResult = MachineGraphSnapshot & {
	positionedNodes: PositionedMachineGraphNode[];
};

export const useStateVisualizer = ({
	currentRoomId,
}: UseStateVisualizerInput): StateVisualizerResult => {
	const graphSnapshot = useMemo(
		() => createMachineGraphSnapshot(currentRoomId),
		[currentRoomId],
	);

	const layout = useMemo(
		() =>
			getGraphLayout({
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
			}),
		[graphSnapshot.edges, graphSnapshot.nodes],
	);

	const positionedNodes = useMemo<PositionedMachineGraphNode[]>(() => {
		const positionByNodeId = new Map(
			layout.nodes.map((node) => [node.id, node.position]),
		);

		return graphSnapshot.nodes.map((node) => ({
			...node,
			position: positionByNodeId.get(node.id) ?? { x: 0, y: 0 },
		}));
	}, [graphSnapshot.nodes, layout.nodes]);

	return {
		nodes: graphSnapshot.nodes,
		edges: graphSnapshot.edges,
		positionedNodes,
	};
};

export type { StateVisualizerResult, UseStateVisualizerInput };
