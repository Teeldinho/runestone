import { buildDoorKey, type DoorStateKey } from "@/entities/dungeon";
import { DOOR_TRANSITION_MAP, type DoorNavigationEvent } from "../config";

export const getDoorKeyForNavigationEvent = (
	eventType: DoorNavigationEvent,
): DoorStateKey => {
	const mapping = DOOR_TRANSITION_MAP[eventType];
	return buildDoorKey(mapping.roomId, mapping.direction);
};
