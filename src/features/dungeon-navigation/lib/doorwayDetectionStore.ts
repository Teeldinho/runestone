import type { DungeonEvent } from "@/entities/dungeon";
import type { DoorSide } from "../config";

type DoorwayDetection = {
	eventType: DungeonEvent;
	doorSide: DoorSide;
	isLocked: boolean;
} | null;

let currentDetection: DoorwayDetection = null;
const listeners = new Set<() => void>();

export const getDoorwayDetection = (): DoorwayDetection => currentDetection;

export const setDoorwayDetection = (detection: DoorwayDetection): void => {
	if (
		currentDetection?.eventType === detection?.eventType &&
		currentDetection?.doorSide === detection?.doorSide
	) {
		return;
	}

	currentDetection = detection;
	listeners.forEach((listener) => {
		listener();
	});
};

export const subscribeToDoorwayDetection = (
	listener: () => void,
): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};
