import { ROOM_LABELS, type RoomId } from "@/entities/dungeon";

import { MACHINE_GRAPH_NODE_KIND, type MachineGraphNodeKind } from "../config";

export const getMachineGraphNodeKind = (roomId: RoomId): MachineGraphNodeKind =>
	MACHINE_GRAPH_NODE_KIND[roomId];

export const getMachineGraphRoomLabel = (roomId: RoomId): string =>
	ROOM_LABELS[roomId];
