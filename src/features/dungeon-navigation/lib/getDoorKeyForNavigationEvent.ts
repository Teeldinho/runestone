import type { DoorStateKey } from "@/entities/dungeon";
import type { NavigationActionEvent } from "../config/navigationActions";

export const getDoorKeyForNavigationEvent = (
	eventType: NavigationActionEvent,
): DoorStateKey | null => {
	const mapping = DOOR_TRANSITION_MAP[eventType];
	if (!mapping) return null;
	return buildDoorKey(mapping.roomId, mapping.direction);
};
