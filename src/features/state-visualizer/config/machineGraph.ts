import { ROOM_IDS, type RoomId } from "@/entities/dungeon";

const MACHINE_GRAPH_NODE_KIND = {
	[ROOM_IDS.ENTRANCE]: "initial",
	[ROOM_IDS.LIBRARY]: "state",
	[ROOM_IDS.GUARD_ROOM]: "state",
	[ROOM_IDS.TREASURY]: "state",
	[ROOM_IDS.EXIT]: "final",
} as const;

type MachineGraphNodeKind =
	(typeof MACHINE_GRAPH_NODE_KIND)[keyof typeof MACHINE_GRAPH_NODE_KIND];

type MachineGraphTransition = {
	id: string;
	source: RoomId;
	target: RoomId;
	guard: string | null;
};

export const MACHINE_GRAPH_ROOM_IDS: RoomId[] = [
	ROOM_IDS.ENTRANCE,
	ROOM_IDS.LIBRARY,
	ROOM_IDS.GUARD_ROOM,
	ROOM_IDS.TREASURY,
	ROOM_IDS.EXIT,
];

export const MACHINE_GRAPH_TRANSITIONS: MachineGraphTransition[] = [
	{
		id: `${ROOM_IDS.ENTRANCE}:${ROOM_IDS.LIBRARY}`,
		source: ROOM_IDS.ENTRANCE,
		target: ROOM_IDS.LIBRARY,
		guard: null,
	},
	{
		id: `${ROOM_IDS.LIBRARY}:${ROOM_IDS.GUARD_ROOM}`,
		source: ROOM_IDS.LIBRARY,
		target: ROOM_IDS.GUARD_ROOM,
		guard: null,
	},
	{
		id: `${ROOM_IDS.LIBRARY}:${ROOM_IDS.ENTRANCE}`,
		source: ROOM_IDS.LIBRARY,
		target: ROOM_IDS.ENTRANCE,
		guard: null,
	},
	{
		id: `${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.TREASURY}`,
		source: ROOM_IDS.GUARD_ROOM,
		target: ROOM_IDS.TREASURY,
		guard: "hasKey & enemies=0",
	},
	{
		id: `${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.ENTRANCE}`,
		source: ROOM_IDS.GUARD_ROOM,
		target: ROOM_IDS.ENTRANCE,
		guard: null,
	},
	{
		id: `${ROOM_IDS.TREASURY}:${ROOM_IDS.EXIT}`,
		source: ROOM_IDS.TREASURY,
		target: ROOM_IDS.EXIT,
		guard: "hasKey",
	},
	{
		id: `${ROOM_IDS.TREASURY}:${ROOM_IDS.GUARD_ROOM}`,
		source: ROOM_IDS.TREASURY,
		target: ROOM_IDS.GUARD_ROOM,
		guard: null,
	},
	{
		id: `${ROOM_IDS.EXIT}:${ROOM_IDS.GUARD_ROOM}`,
		source: ROOM_IDS.EXIT,
		target: ROOM_IDS.GUARD_ROOM,
		guard: null,
	},
];

export const MACHINE_GRAPH_LAYOUT = {
	DIRECTION: "LR",
	NODE_WIDTH: 160,
	NODE_HEIGHT: 60,
	NODE_SEPARATION: 80,
	RANK_SEPARATION: 120,
} as const;

export type { MachineGraphNodeKind, MachineGraphTransition };
export { MACHINE_GRAPH_NODE_KIND };
