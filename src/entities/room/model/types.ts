import type { Vector3Tuple } from "@/shared/types";

export type RoomKind = "start" | "exploration" | "combat" | "reward" | "exit";

export type RoomDoorGuard = "none" | "keyRune" | "combatRune" | "puzzleRune";

export type RoomNode = {
	id: string;
	name: string;
	kind: RoomKind;
	worldPosition: Vector3Tuple;
	doorGuard: RoomDoorGuard;
};
