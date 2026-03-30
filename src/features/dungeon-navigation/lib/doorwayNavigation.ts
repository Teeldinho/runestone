import {
	canEnterFloorOneExit,
	canEnterFloorOneTreasury,
	createFloorOneContext,
	type DungeonEvent,
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

const isPlayerWithinRoomBounds = (localX: number, localZ: number): boolean => {
	const roomHalfWidth = ROOM_CONFIG.WIDTH / 2;
	const roomHalfDepth = ROOM_CONFIG.DEPTH / 2;

	return (
		Math.abs(localX) <=
			roomHalfWidth + DOORWAY_NAVIGATION_CONFIG.DOOR_PROXIMITY_THRESHOLD &&
		Math.abs(localZ) <=
			roomHalfDepth + DOORWAY_NAVIGATION_CONFIG.DOOR_PROXIMITY_THRESHOLD
	);
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
	currentRoomId: RoomId,
	doorGuard: DoorGuard,
	hasTreasureKey: boolean,
	enemiesRemaining: number,
): boolean => {
	if (doorGuard === "none") {
		return true;
	}

	const guardContext = createFloorOneContext({
		currentRoomId,
		hasTreasureKey,
		enemiesRemaining,
	});

	if (doorGuard === "treasury") {
		return canEnterFloorOneTreasury(guardContext);
	}

	return canEnterFloorOneExit(guardContext);
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
		isDoorGuardOpen(
			currentRoomId,
			doorwayInteraction.guard,
			hasTreasureKey,
			enemiesRemaining,
		)
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

export const checkPlayerWithinRoomBounds = ({
	roomCenterPosition,
	playerPosition,
}: Pick<
	ResolveDoorwayNavigationInput,
	"roomCenterPosition" | "playerPosition"
>): boolean => {
	const localX = playerPosition[0] - roomCenterPosition[0];
	const localZ = playerPosition[2] - roomCenterPosition[2];

	return isPlayerWithinRoomBounds(localX, localZ);
};

export type { DoorwayNavigationEvent, ResolveDoorwayNavigationInput };
