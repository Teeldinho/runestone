import type { MutationCtx, QueryCtx } from "../_generated/server";
import { BACKEND_ERROR_MESSAGES } from "../config";
import {
	assertRoomDiscoveryRange,
	assertRunTimingRange,
	assertScoreRange,
	clampLeaderboardLimit,
	createScoreEntry,
} from "../lib/scoreRules";
import type {
	GetDungeonLeaderboardArgs,
	ScoreEntry,
	SubmitDungeonRunScoreArgs,
	SubmitDungeonRunScoreResult,
} from "../model/scoreTypes";

export const handleDungeonLeaderboardGet = async (
	ctx: QueryCtx,
	args: GetDungeonLeaderboardArgs,
): Promise<ScoreEntry[]> => {
	const limit = clampLeaderboardLimit(args.limit);

	const runs = await ctx.db
		.query("dungeon_runs")
		.withIndex("by_dungeon_and_score", (indexQuery) =>
			indexQuery.eq("dungeonId", args.dungeonId),
		)
		.order("desc")
		.take(limit);

	return runs.map((run) => createScoreEntry(run));
};

export const handleDungeonRunScoreSubmit = async (
	ctx: MutationCtx,
	args: SubmitDungeonRunScoreArgs,
): Promise<SubmitDungeonRunScoreResult> => {
	assertScoreRange(args.score);
	assertRunTimingRange(args.timeMs);
	assertRoomDiscoveryRange(args.roomsDiscovered);

	const user = await ctx.db.get(args.userId);

	if (!user) {
		throw new Error(BACKEND_ERROR_MESSAGES.USER_NOT_FOUND);
	}

	const completedAt = Date.now();
	const runId = await ctx.db.insert("dungeon_runs", {
		userId: user._id,
		username: user.username,
		discriminator: user.discriminator,
		dungeonId: args.dungeonId,
		score: args.score,
		timeMs: args.timeMs,
		roomsDiscovered: args.roomsDiscovered,
		completedAt,
	});

	return {
		runId,
		completedAt,
	};
};
