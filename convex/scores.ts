import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import {
	handleDungeonLeaderboardGet,
	handleDungeonRunScoreSubmit,
} from "./api/scoresApi";

export const getDungeonLeaderboard = query({
	args: {
		dungeonId: v.string(),
		limit: v.number(),
	},
	handler: handleDungeonLeaderboardGet,
});

export const submitDungeonRunScore = mutation({
	args: {
		userId: v.id("users"),
		dungeonId: v.string(),
		score: v.number(),
		timeMs: v.number(),
		roomsDiscovered: v.number(),
	},
	handler: handleDungeonRunScoreSubmit,
});
