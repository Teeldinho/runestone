import type { FloorId } from "@/entities/dungeon";
import { FLOOR_IDS } from "@/entities/dungeon";
import { SCORE_VALUES } from "@/shared/config";

export const computeDungeonRunScore = (roomsDiscovered: number): number =>
	roomsDiscovered * SCORE_VALUES.ROOM_DISCOVERY;

export const buildScoreSubmission = (
	authenticatedProfile: { id: string },
	roomsDiscovered: number,
	startTimeMs: number,
): {
	userId: string;
	dungeonId: FloorId;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
} => ({
	userId: authenticatedProfile.id,
	dungeonId: FLOOR_IDS.FLOOR_ONE,
	score: computeDungeonRunScore(roomsDiscovered),
	timeMs: Date.now() - startTimeMs,
	roomsDiscovered,
});

export const getPlayerHealthState = (
	playerSnapshotValue: Record<string, unknown>,
): string | undefined => {
	return playerSnapshotValue["health" as keyof typeof playerSnapshotValue] as
		| string
		| undefined;
};
