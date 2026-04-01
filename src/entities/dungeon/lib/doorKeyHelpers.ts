import type {
	DoorSide,
	DoorStateKey,
} from "@/entities/dungeon/config/dungeonEvents";

export const buildDoorKey = (
	roomId: string,
	doorSide: DoorSide,
): DoorStateKey => `${roomId}:${doorSide}`;
