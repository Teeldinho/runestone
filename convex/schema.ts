import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		uuid: v.string(),
		username: v.string(),
		discriminator: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_uuid", ["uuid"])
		.index("by_username_and_discriminator", ["username", "discriminator"]),
	dungeon_runs: defineTable({
		userId: v.id("users"),
		username: v.string(),
		discriminator: v.string(),
		dungeonId: v.string(),
		score: v.number(),
		timeMs: v.number(),
		roomsDiscovered: v.number(),
		completedAt: v.number(),
	})
		.index("by_dungeon_and_score", ["dungeonId", "score"])
		.index("by_user", ["userId"]),
	game_progress: defineTable({
		userId: v.id("users"),
		slot: v.number(),
		snapshot: v.string(),
		savedAt: v.number(),
	}).index("by_user_and_slot", ["userId", "slot"]),
});
