import { DOOR_SIDES, type LastTransition } from "@/entities/dungeon";
import { DOORWAY_NAVIGATION_CONFIG } from "@/features/dungeon-navigation";
import type { Vector3Tuple } from "@/shared/types";

import { getDoorwayAnchorPosition } from "./getDoorwayAnchorPosition";

type GetDoorwayArrivalPositionInput = {
	currentRoomPosition: Vector3Tuple;
	lastTransition: LastTransition | null;
	spawnHeightOffset: number;
};

const createRoomCenterPosition = (
	[currentX, , currentZ]: Vector3Tuple,
	spawnHeightOffset: number,
): Vector3Tuple => [currentX, spawnHeightOffset, currentZ];

export const getDoorwayArrivalPosition = ({
	currentRoomPosition,
	lastTransition,
	spawnHeightOffset,
}: GetDoorwayArrivalPositionInput): Vector3Tuple => {
	const doorwayEntrySide = lastTransition?.doorSide ?? null;

	if (!doorwayEntrySide) {
		return createRoomCenterPosition(currentRoomPosition, spawnHeightOffset);
	}

	const doorwayAnchor = getDoorwayAnchorPosition(
		currentRoomPosition,
		doorwayEntrySide,
		spawnHeightOffset,
	);
	const arrivalOffset = DOORWAY_NAVIGATION_CONFIG.ARRIVAL_OFFSET;

	if (doorwayEntrySide === DOOR_SIDES.WEST) {
		return [
			doorwayAnchor[0] + arrivalOffset,
			doorwayAnchor[1],
			doorwayAnchor[2],
		];
	}

	if (doorwayEntrySide === DOOR_SIDES.EAST) {
		return [
			doorwayAnchor[0] - arrivalOffset,
			doorwayAnchor[1],
			doorwayAnchor[2],
		];
	}

	if (doorwayEntrySide === DOOR_SIDES.NORTH) {
		return [
			doorwayAnchor[0],
			doorwayAnchor[1],
			doorwayAnchor[2] + arrivalOffset,
		];
	}

	if (doorwayEntrySide === DOOR_SIDES.SOUTH) {
		return [
			doorwayAnchor[0],
			doorwayAnchor[1],
			doorwayAnchor[2] - arrivalOffset,
		];
	}

	return createRoomCenterPosition(currentRoomPosition, spawnHeightOffset);
};

export type { GetDoorwayArrivalPositionInput };
