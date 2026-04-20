import {
	DOOR_SIDE_LABELS,
	type DungeonInteractableId,
	INTERACTABLE_ID_LABELS,
	ROOM_LABELS,
	type RoomId,
} from "@/entities/dungeon";

import { INTERACTION_LABEL_PARTS } from "../config";

export const formatNearInteractableLabel = (
	interactableId: DungeonInteractableId | null,
): string => {
	if (interactableId === null) {
		return INTERACTION_LABEL_PARTS.NONE;
	}

	const colonIndex = interactableId.indexOf(":");

	if (colonIndex !== -1) {
		const roomPart = interactableId.slice(0, colonIndex) as RoomId;
		const sidePart = interactableId.slice(
			colonIndex + 1,
		) as keyof typeof DOOR_SIDE_LABELS;

		const roomLabel = ROOM_LABELS[roomPart] ?? roomPart;
		const sideLabel = DOOR_SIDE_LABELS[sidePart] ?? sidePart;

		return `${roomLabel}, ${sideLabel}`;
	}

	const label =
		INTERACTABLE_ID_LABELS[
			interactableId as keyof typeof INTERACTABLE_ID_LABELS
		];
	return label ?? interactableId;
};
