import type { RoomWallOpening } from "../model";

export const hasOpening = (
	side: RoomWallOpening,
	wallOpenings: RoomWallOpening[],
): boolean => wallOpenings.includes(side);

export const isDoorLocked = (
	side: RoomWallOpening,
	lockedDoorSides: RoomWallOpening[],
): boolean => lockedDoorSides.includes(side);

export const isDoorOpened = (
	side: RoomWallOpening,
	openedDoorSides: RoomWallOpening[],
): boolean => openedDoorSides.includes(side);

export const shouldRenderCollider = (
	side: RoomWallOpening,
	wallOpenings: RoomWallOpening[],
	openedDoorSides: RoomWallOpening[],
): boolean =>
	hasOpening(side, wallOpenings) && !isDoorOpened(side, openedDoorSides);
