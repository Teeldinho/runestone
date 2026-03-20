import type { RoomId } from "@/entities/dungeon";

export type MachineGraphNodeKind = "state" | "initial" | "final";

export type MachineGraphNode = {
	id: RoomId;
	label: string;
	kind: MachineGraphNodeKind;
	isActive: boolean;
};

export type MachineGraphEdge = {
	id: string;
	source: RoomId;
	target: RoomId;
	guard: string | null;
};
