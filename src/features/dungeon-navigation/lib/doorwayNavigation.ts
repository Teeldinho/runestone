import {
	buildDoorKey,
	canEnterFloorOneExit,
	canEnterFloorOneTreasury,
	createFloorOneContext,
	DOOR_SIDES,
	DUNGEON_EVENTS,
	DUNGEON_INTERACTABLE_IDS,
	type DungeonEvent,
	type DungeonInteractableId,
	INTERACTION_TYPES,
	type InteractionType,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";
import { ROOM_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import {
	DOOR_GUARDS,
	DOORWAY_INTERACTIONS_BY_ROOM,
	DOORWAY_NAVIGATION_CONFIG,
	type DoorGuard,
	type DoorSide,
} from "../config";
import { INTERACTION_CONFIG } from "../config/interactionConfig";

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

type NearbyInteractable = {
	interactableId: DungeonInteractableId;
	interactableType: InteractionType;
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
		return DOOR_SIDES.NORTH;
	}

	if (
		Math.abs(localX) <= doorwayHalfWidth &&
		Math.abs(localZ - roomHalfDepth) <= threshold
	) {
		return DOOR_SIDES.SOUTH;
	}

	if (
		Math.abs(localZ) <= doorwayHalfWidth &&
		Math.abs(localX - roomHalfWidth) <= threshold
	) {
		return DOOR_SIDES.EAST;
	}

	if (
		Math.abs(localZ) <= doorwayHalfWidth &&
		Math.abs(localX + roomHalfWidth) <= threshold
	) {
		return DOOR_SIDES.WEST;
	}

	return null;
};

const isDoorGuardOpen = (
	currentRoomId: RoomId,
	doorGuard: DoorGuard,
	hasTreasureKey: boolean,
	enemiesRemaining: number,
): boolean => {
	if (doorGuard === DOOR_GUARDS.NONE) {
		return true;
	}

	const guardContext = createFloorOneContext({
		currentRoomId,
		hasTreasureKey,
		enemiesRemaining,
	});

	if (doorGuard === DOOR_GUARDS.TREASURY) {
		return canEnterFloorOneTreasury(guardContext);
	}

	return canEnterFloorOneExit(guardContext);
};

const isNearTreasureKey = (
	playerPosition: Vector3Tuple,
	roomCenterPosition: Vector3Tuple,
): boolean => {
	const deltaX = playerPosition[0] - roomCenterPosition[0];
	const deltaZ = playerPosition[2] - roomCenterPosition[2];

	return Math.hypot(deltaX, deltaZ) <= INTERACTION_CONFIG.INTERACT_RADIUS;
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

export const resolveNearInteractableTarget = (
	input: ResolveDoorwayNavigationInput,
): NearbyInteractable | null => {
	if (
		input.currentRoomId === ROOM_IDS.GUARD_ROOM &&
		!input.hasTreasureKey &&
		isNearTreasureKey(input.playerPosition, input.roomCenterPosition)
	) {
		return {
			interactableId: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
			interactableType: INTERACTION_TYPES.KEY,
		};
	}

	const doorwayEvent = resolveDoorwayNavigationEvent(input);

	if (!doorwayEvent) {
		return null;
	}

	return {
		interactableId: buildDoorKey(input.currentRoomId, doorwayEvent.doorSide),
		interactableType:
			doorwayEvent.eventType === DUNGEON_EVENTS.ENTER_EXIT ||
			doorwayEvent.eventType === DUNGEON_EVENTS.LOCKED_EXIT_ATTEMPT
				? INTERACTION_TYPES.EXIT
				: INTERACTION_TYPES.DOOR,
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

export type {
	DoorwayNavigationEvent,
	NearbyInteractable,
	ResolveDoorwayNavigationInput,
};
