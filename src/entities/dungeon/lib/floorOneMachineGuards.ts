import { DUNGEON_INTERACTABLE_IDS, ROOM_IDS } from "@/entities/dungeon/config";

import type {
	DungeonInteractableId,
	DungeonMachineContext,
} from "../model/types";

export const checkFloorOneNearInteractable = (
	context: DungeonMachineContext,
	interactableId: DungeonInteractableId,
): boolean => context.nearInteractable === interactableId;

export const checkFloorOneCanPickUpTreasureKey = (
	context: DungeonMachineContext,
): boolean => {
	return (
		context.currentRoomId === ROOM_IDS.GUARD_ROOM &&
		!context.hasTreasureKey &&
		context.nearInteractable === DUNGEON_INTERACTABLE_IDS.TREASURE_KEY
	);
};
