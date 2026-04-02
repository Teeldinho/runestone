import type { RoomId } from "@/entities/dungeon";

import { MACHINE_GRAPH_ROOM_IDS, MACHINE_GRAPH_TRANSITIONS } from "../config";
import type { MachineGraphEdge, MachineGraphNode } from "../model/types";
import {
	getMachineGraphNodeKind,
	getMachineGraphRoomLabel,
} from "./machineGraphSelectors";

type MachineGraphSnapshot = {
	nodes: MachineGraphNode[];
	edges: MachineGraphEdge[];
};

export const createMachineGraphSnapshot = (
	currentRoomId: RoomId,
): MachineGraphSnapshot => {
	const nodes = MACHINE_GRAPH_ROOM_IDS.map((roomId) => ({
		id: roomId,
		label: getMachineGraphRoomLabel(roomId),
		kind: getMachineGraphNodeKind(roomId),
		isActive: currentRoomId === roomId,
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
