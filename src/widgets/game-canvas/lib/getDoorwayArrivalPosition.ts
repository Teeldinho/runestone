import { DOORWAY_NAVIGATION_CONFIG } from "@/features/dungeon-navigation";
import { ROOM_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

type GetDoorwayArrivalPositionInput = {
	currentRoomPosition: Vector3Tuple;
	previousRoomPosition: Vector3Tuple | null;
	spawnHeightOffset: number;
};

const createRoomCenterPosition = (
	[currentX, , currentZ]: Vector3Tuple,
	spawnHeightOffset: number,
): Vector3Tuple => [currentX, spawnHeightOffset, currentZ];

export const resolveDoorwayEntrySide = ({
	currentRoomPosition,
	previousRoomPosition,
}: {
	currentRoomPosition: Vector3Tuple;
	previousRoomPosition: Vector3Tuple | null;
}): "north" | "south" | "east" | "west" | null => {
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
		return deltaZ < 0 ? "north" : "south";
	}

	if (Math.abs(deltaZ) <= DOORWAY_NAVIGATION_CONFIG.ENTRY_POSITION_EPSILON) {
		return deltaX < 0 ? "west" : "east";
	}

	return null;
};

export const getDoorwayArrivalPosition = ({
	currentRoomPosition,
	previousRoomPosition,
	spawnHeightOffset,
}: GetDoorwayArrivalPositionInput): Vector3Tuple => {
	const doorwayEntrySide = resolveDoorwayEntrySide({
		currentRoomPosition,
		previousRoomPosition,
	});

	if (!doorwayEntrySide) {
		return createRoomCenterPosition(currentRoomPosition, spawnHeightOffset);
	}

	const [currentX, , currentZ] = currentRoomPosition;
	const arrivalOffset = DOORWAY_NAVIGATION_CONFIG.ARRIVAL_OFFSET;
	const roomHalfWidth = ROOM_CONFIG.WIDTH / 2;
	const roomHalfDepth = ROOM_CONFIG.DEPTH / 2;

	if (doorwayEntrySide === "west") {
		return [
			currentX - (roomHalfWidth - arrivalOffset),
			spawnHeightOffset,
			currentZ,
		];
	}

	if (doorwayEntrySide === "east") {
		return [
			currentX + (roomHalfWidth - arrivalOffset),
			spawnHeightOffset,
			currentZ,
		];
	}

	if (doorwayEntrySide === "north") {
		return [
			currentX,
			spawnHeightOffset,
			currentZ - (roomHalfDepth - arrivalOffset),
		];
	}

	if (doorwayEntrySide === "south") {
		return [
			currentX,
			spawnHeightOffset,
			currentZ + (roomHalfDepth - arrivalOffset),
		];
	}

	return createRoomCenterPosition(currentRoomPosition, spawnHeightOffset);
};

export type { GetDoorwayArrivalPositionInput };
