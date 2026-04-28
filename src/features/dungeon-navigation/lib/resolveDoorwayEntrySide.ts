import { DOOR_SIDES, type DoorSide } from "@/entities/dungeon";
import type { Vector3Tuple } from "@/shared/lib";

import { DOORWAY_NAVIGATION_CONFIG } from "../config";

type ResolveDoorwayEntrySideInput = {
	currentRoomPosition: Vector3Tuple;
	previousRoomPosition: Vector3Tuple | null;
};

export const resolveDoorwayEntrySide = ({
	currentRoomPosition,
	previousRoomPosition,
}: ResolveDoorwayEntrySideInput): DoorSide | null => {
	if (!previousRoomPosition) {
		return null;
	}

	const [currentX, , currentZ] = currentRoomPosition;
	const [previousX, , previousZ] = previousRoomPosition;
	const deltaX = previousX - currentX;
	const deltaZ = previousZ - currentZ;

	if (
		Math.abs(deltaX) <= DOORWAY_NAVIGATION_CONFIG.ENTRY_POSITION_EPSILON &&
		Math.abs(deltaZ) <= DOORWAY_NAVIGATION_CONFIG.ENTRY_POSITION_EPSILON
	) {
		return null;
	}

	if (Math.abs(deltaX) <= DOORWAY_NAVIGATION_CONFIG.ENTRY_POSITION_EPSILON) {
		return deltaZ < 0 ? DOOR_SIDES.NORTH : DOOR_SIDES.SOUTH;
	}

	if (Math.abs(deltaZ) <= DOORWAY_NAVIGATION_CONFIG.ENTRY_POSITION_EPSILON) {
		return deltaX < 0 ? DOOR_SIDES.WEST : DOOR_SIDES.EAST;
	}

	return null;
};

export type { DoorSide, ResolveDoorwayEntrySideInput };
