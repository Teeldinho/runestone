import { buildDoorKey, type DoorStateKey } from "@/entities/dungeon";
import { DOOR_TRANSITION_MAP, type NavigationActionEvent } from "../config";

export const getDoorKeyForNavigationEvent = (
	eventType: NavigationActionEvent,
): DoorStateKey | null => {
	const mapping = DOOR_TRANSITION_MAP[eventType];
	if (!mapping) return null;
	return buildDoorKey(mapping.roomId, mapping.direction);
};
