import {
	type DungeonEvent,
	FLOOR_ONE_MACHINE_RULES,
	type RoomId,
} from "@/entities/dungeon";
import { ROOM_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import {
	DOORWAY_INTERACTIONS_BY_ROOM,
	DOORWAY_NAVIGATION_CONFIG,
	type DoorGuard,
	type DoorSide,
} from "../config";

type ResolveDoorwayNavigationInput = {
	currentRoomId: RoomId;
	roomCenterPosition: Vector3Tuple;
	playerPosition: Vector3Tuple;
	hasTreasureKey: boolean;
	enemiesRemaining: number;
};

type DoorwayNavigationEvent = {
	eventType: DungeonEvent;
	isLocked: boolean;
	doorSide: DoorSide;
};

const resolveNearDoorSide = (
	localX: number,
	localZ: number,
): DoorSide | null => {
	const threshold = DOORWAY_NAVIGATION_CONFIG.DOOR_PROXIMITY_THRESHOLD;
	const doorwayHalfWidth = DOORWAY_NAVIGATION_CONFIG.DOORWAY_HALF_WIDTH;
	const roomHalfWidth = ROOM_CONFIG.WIDTH / 2;
	const roomHalfDepth = ROOM_CONFIG.DEPTH / 2;

	if (
		Math.abs(localX) <= doorwayHalfWidth &&
		Math.abs(localZ + roomHalfDepth) <= threshold
	) {
		return "north";
	}

	if (
		Math.abs(localX) <= doorwayHalfWidth &&
		Math.abs(localZ - roomHalfDepth) <= threshold
	) {
		return "south";
	}

	if (
		Math.abs(localZ) <= doorwayHalfWidth &&
		Math.abs(localX - roomHalfWidth) <= threshold
	) {
		return "east";
	}

	if (
		Math.abs(localZ) <= doorwayHalfWidth &&
		Math.abs(localX + roomHalfWidth) <= threshold
	) {
		return "west";
	}

	return null;
};

const isDoorGuardOpen = (
	doorGuard: DoorGuard,
	hasTreasureKey: boolean,
	enemiesRemaining: number,
): boolean => {
	if (doorGuard === "none") {
		return true;
	}

	if (doorGuard === "treasury") {
		return (
			hasTreasureKey &&
			enemiesRemaining === FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING
		);
	}

	return hasTreasureKey;
};

export const resolveDoorwayNavigationEvent = ({
	currentRoomId,
	roomCenterPosition,
	playerPosition,
	hasTreasureKey,
	enemiesRemaining,
}: ResolveDoorwayNavigationInput): DoorwayNavigationEvent | null => {
	const localX = playerPosition[0] - roomCenterPosition[0];
	const localZ = playerPosition[2] - roomCenterPosition[2];
	const doorSide = resolveNearDoorSide(localX, localZ);

	if (!doorSide) {
		return null;
	}

	const roomInteractions = DOORWAY_INTERACTIONS_BY_ROOM[currentRoomId];
	const doorwayInteraction = roomInteractions?.[doorSide];

	if (!doorwayInteraction) {
		return null;
	}

	if (
		isDoorGuardOpen(doorwayInteraction.guard, hasTreasureKey, enemiesRemaining)
	) {
		return {
			eventType: doorwayInteraction.successEvent,
			isLocked: false,
			doorSide,
		};
	}

	if (!doorwayInteraction.lockedEvent) {
		return null;
	}

	return {
		eventType: doorwayInteraction.lockedEvent,
		isLocked: true,
		doorSide,
	};
};

export type { DoorwayNavigationEvent, ResolveDoorwayNavigationInput };
