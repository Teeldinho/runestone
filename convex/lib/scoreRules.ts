import type { Doc, Id } from "../_generated/dataModel";
import { BACKEND_ERROR_MESSAGES, SCORE_LIMITS } from "../config";

type PersistedDungeonRun = Pick<
	Doc<"dungeon_runs">,
	| "userId"
	| "username"
	| "discriminator"
	| "dungeonId"
	| "score"
	| "timeMs"
	| "roomsDiscovered"
	| "completedAt"
>;

type ScoreEntry = {
	userId: Id<"users">;
	username: string;
	discriminator: string;
	floorId: string;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
	completedAt: number;
};

export const clampLeaderboardLimit = (limit: number): number => {
	const normalizedLimit = Math.trunc(limit);

	if (normalizedLimit < SCORE_LIMITS.LEADERBOARD_MIN_LIMIT) {
		return SCORE_LIMITS.LEADERBOARD_MIN_LIMIT;
	}

	if (normalizedLimit > SCORE_LIMITS.LEADERBOARD_MAX_LIMIT) {
		return SCORE_LIMITS.LEADERBOARD_MAX_LIMIT;
	}

	return normalizedLimit;
};

export const assertScoreRange = (score: number): void => {
	if (score < SCORE_LIMITS.SCORE_MIN || score > SCORE_LIMITS.SCORE_MAX) {
		throw new Error(BACKEND_ERROR_MESSAGES.SCORE_OUT_OF_BOUNDS);
	}
};

export const assertRunTimingRange = (timeMs: number): void => {
	if (timeMs < SCORE_LIMITS.TIME_MS_MIN || timeMs > SCORE_LIMITS.TIME_MS_MAX) {
		throw new Error(BACKEND_ERROR_MESSAGES.RUN_TIME_OUT_OF_BOUNDS);
	}
};

export const assertRoomDiscoveryRange = (roomsDiscovered: number): void => {
	if (
		roomsDiscovered < SCORE_LIMITS.ROOMS_DISCOVERED_MIN ||
		roomsDiscovered > SCORE_LIMITS.ROOMS_DISCOVERED_MAX
	) {
		throw new Error(BACKEND_ERROR_MESSAGES.ROOM_DISCOVERY_OUT_OF_BOUNDS);
	}
};

export const createScoreEntry = (run: PersistedDungeonRun): ScoreEntry => ({
	userId: run.userId,
	username: run.username,
	discriminator: run.discriminator,
	floorId: run.dungeonId,
	score: run.score,
	timeMs: run.timeMs,
	roomsDiscovered: run.roomsDiscovered,
	completedAt: run.completedAt,
});

export type { PersistedDungeonRun, ScoreEntry };
