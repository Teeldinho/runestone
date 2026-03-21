import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const LEADERBOARD_MIN_LIMIT = 1;
const LEADERBOARD_MAX_LIMIT = 50;

const SCORE_MIN = 0;
const SCORE_MAX = 200000;

const TIME_MS_MIN = 1;
const TIME_MS_MAX = 7200000;

const ROOMS_DISCOVERED_MIN = 0;
const ROOMS_DISCOVERED_MAX = 50;

const USER_NOT_FOUND_ERROR = "Cannot submit score for unknown user.";

const clampLeaderboardLimit = (limit: number): number => {
	const normalizedLimit = Math.trunc(limit);

	if (normalizedLimit < LEADERBOARD_MIN_LIMIT) {
		return LEADERBOARD_MIN_LIMIT;
	}

	if (normalizedLimit > LEADERBOARD_MAX_LIMIT) {
		return LEADERBOARD_MAX_LIMIT;
	}

	return normalizedLimit;
};

const assertScoreRange = (score: number): void => {
	if (score < SCORE_MIN || score > SCORE_MAX) {
		throw new Error("Score is out of accepted bounds.");
	}
};

const assertRunTimingRange = (timeMs: number): void => {
	if (timeMs < TIME_MS_MIN || timeMs > TIME_MS_MAX) {
		throw new Error("Run time is out of accepted bounds.");
	}
};

const assertRoomDiscoveryRange = (roomsDiscovered: number): void => {
	if (
		roomsDiscovered < ROOMS_DISCOVERED_MIN ||
		roomsDiscovered > ROOMS_DISCOVERED_MAX
	) {
		throw new Error("Rooms discovered is out of accepted bounds.");
	}
};

export const getLeaderboard = query({
	args: {
		dungeonId: v.string(),
		limit: v.number(),
	},
	handler: async (ctx, args) => {
		const limit = clampLeaderboardLimit(args.limit);

		const runs = await ctx.db
			.query("dungeon_runs")
			.withIndex("by_dungeon_and_score", (indexQuery) =>
				indexQuery.eq("dungeonId", args.dungeonId),
			)
			.order("desc")
			.take(limit);

		return runs.map((run) => ({
			userId: run.userId,
			username: run.username,
			discriminator: run.discriminator,
			floorId: run.dungeonId,
			score: run.score,
			timeMs: run.timeMs,
			roomsDiscovered: run.roomsDiscovered,
			completedAt: run.completedAt,
		}));
	},
});

export const submit = mutation({
	args: {
		userId: v.id("users"),
		dungeonId: v.string(),
		score: v.number(),
		timeMs: v.number(),
		roomsDiscovered: v.number(),
	},
	handler: async (ctx, args) => {
		assertScoreRange(args.score);
		assertRunTimingRange(args.timeMs);
		assertRoomDiscoveryRange(args.roomsDiscovered);

		const user = await ctx.db.get(args.userId);

		if (!user) {
			throw new Error(USER_NOT_FOUND_ERROR);
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
	},
});
