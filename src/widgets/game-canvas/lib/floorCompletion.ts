import { ROOM_IDS } from "@/entities/dungeon";

export const shouldSubmitFloorScore = (
	snapshotValue: string,
	hasSubmitted: boolean,
): boolean => snapshotValue === ROOM_IDS.EXIT && !hasSubmitted;
