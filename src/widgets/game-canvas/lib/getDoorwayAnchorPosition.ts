import type { DoorSide } from "@/entities/dungeon";
import { getRoomCorridorAnchors } from "@/entities/room";
import { ROOM_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

export const getDoorwayAnchorPosition = (
	roomPosition: Vector3Tuple,
	doorSide: DoorSide,
	height: number,
): Vector3Tuple => {
	const doorwayAnchor = getRoomCorridorAnchors({
		center: roomPosition,
		dimensions: {
			depth: ROOM_CONFIG.DEPTH,
			height: ROOM_CONFIG.HEIGHT,
			width: ROOM_CONFIG.WIDTH,
		},
	})[doorSide];

	return [doorwayAnchor[0], roomPosition[1] + height, doorwayAnchor[2]];
};
