import type {
	DoorSide,
	DoorStateKey,
} from "@/entities/dungeon/config/dungeonEvents";

export const buildDoorKey = (
	roomId: string,
	doorSide: DoorSide,
): DoorStateKey => `${roomId}:${doorSide}`;

export const parseDoorKey = (
	doorKey: DoorStateKey,
): { doorSide: DoorSide; roomId: string } => {
	const [roomId, doorSide] = doorKey.split(":");

	return {
		roomId,
		doorSide: doorSide as DoorSide,
	};
};
