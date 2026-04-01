import type { RoomWallOpening } from "../model";

type DoorKey = `${string}:${RoomWallOpening}`;

const openedDoors = new Set<DoorKey>();
const listeners = new Set<() => void>();

const buildKey = (roomId: string, doorSide: RoomWallOpening): DoorKey =>
	`${roomId}:${doorSide}`;

export const isDoorOpened = (
	roomId: string,
	doorSide: RoomWallOpening,
): boolean => openedDoors.has(buildKey(roomId, doorSide));

export const markDoorOpened = (
	roomId: string,
	doorSide: RoomWallOpening,
): void => {
	const key = buildKey(roomId, doorSide);
	if (openedDoors.has(key)) {
		return;
	}

	openedDoors.add(key);
	listeners.forEach((listener) => {
		listener();
	});
};

export const subscribeToDoorOpenState = (
	listener: () => void,
): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

export const resetDoorOpenStore = (): void => {
	openedDoors.clear();
	listeners.forEach((listener) => {
		listener();
	});
};
