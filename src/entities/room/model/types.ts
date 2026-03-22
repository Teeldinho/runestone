import type { Vector3Tuple } from "@/shared/types";
import type { ROOM_DOOR_GUARDS, ROOM_KINDS } from "../config";

export type RoomKind = (typeof ROOM_KINDS)[keyof typeof ROOM_KINDS];

export type RoomDoorGuard =
	(typeof ROOM_DOOR_GUARDS)[keyof typeof ROOM_DOOR_GUARDS];

export type RoomNode = {
	id: string;
	name: string;
	kind: RoomKind;
	worldPosition: Vector3Tuple;
	doorGuard: RoomDoorGuard;
};
