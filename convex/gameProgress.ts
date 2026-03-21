import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const SAVE_SLOT_MIN = 1;
const SAVE_SLOT_MAX = 3;

const assertSaveSlotRange = (slot: number): void => {
	if (slot < SAVE_SLOT_MIN || slot > SAVE_SLOT_MAX) {
		throw new Error("Save slot is out of accepted bounds.");
	}
};

export const getByUserAndSlot = query({
	args: {
		userId: v.id("users"),
		slot: v.number(),
	},
	handler: async (ctx, args) => {
		assertSaveSlotRange(args.slot);

		const progress = await ctx.db
			.query("game_progress")
			.withIndex("by_user_and_slot", (indexQuery) =>
				indexQuery.eq("userId", args.userId).eq("slot", args.slot),
			)
			.unique();

		if (!progress) {
			return null;
		}

		return {
			id: progress._id,
			userId: progress.userId,
			slot: progress.slot,
			snapshot: progress.snapshot,
			savedAt: progress.savedAt,
		};
	},
});

export const save = mutation({
	args: {
		userId: v.id("users"),
		slot: v.number(),
		snapshot: v.string(),
	},
	handler: async (ctx, args) => {
		assertSaveSlotRange(args.slot);

		const existingProgress = await ctx.db
			.query("game_progress")
			.withIndex("by_user_and_slot", (indexQuery) =>
				indexQuery.eq("userId", args.userId).eq("slot", args.slot),
			)
			.unique();

		const savedAt = Date.now();

		if (existingProgress) {
			await ctx.db.patch(existingProgress._id, {
				snapshot: args.snapshot,
				savedAt,
			});

			return {
				id: existingProgress._id,
				savedAt,
			};
		}

		const progressId = await ctx.db.insert("game_progress", {
			userId: args.userId,
			slot: args.slot,
			snapshot: args.snapshot,
			savedAt,
		});

		return {
			id: progressId,
			savedAt,
		};
	},
});
