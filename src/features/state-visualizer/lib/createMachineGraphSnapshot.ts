import type { DungeonContext } from "@/entities/dungeon";

import {
	getMachineGraphNodeKind,
	getMachineGraphRoomLabel,
	MACHINE_GRAPH_ROOM_IDS,
	MACHINE_GRAPH_TRANSITIONS,
} from "../config";
import type { MachineGraphEdge, MachineGraphNode } from "../model/types";

type MachineGraphSnapshot = {
	nodes: MachineGraphNode[];
	edges: MachineGraphEdge[];
};

export const createMachineGraphSnapshot = (
	context: DungeonContext,
): MachineGraphSnapshot => {
	const nodes = MACHINE_GRAPH_ROOM_IDS.map((roomId) => ({
		id: roomId,
		label: getMachineGraphRoomLabel(roomId),
		kind: getMachineGraphNodeKind(roomId),
		isActive: context.currentRoomId === roomId,
	}));

	const edges = MACHINE_GRAPH_TRANSITIONS.map((transition) => ({
		id: transition.id,
		source: transition.source,
		target: transition.target,
		guard: transition.guard,
	}));

	return {
		nodes,
		edges,
	};
};

export type { MachineGraphSnapshot };
