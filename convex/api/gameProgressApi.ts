import type { MutationCtx, QueryCtx } from "../_generated/server";
import {
	assertSaveSlotRange,
	createGameProgressSaveResult,
	createGameProgressSnapshot,
} from "../lib/gameProgressRules";
import type {
	GameProgressSnapshot,
	GetGameProgressByUserAndSlotArgs,
	ProgressSaveResult,
	SaveGameProgressByUserAndSlotArgs,
} from "../model/gameProgressTypes";

export const handleGameProgressByUserAndSlotGet = async (
	ctx: QueryCtx,
	args: GetGameProgressByUserAndSlotArgs,
): Promise<GameProgressSnapshot | null> => {
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

	return createGameProgressSnapshot(progress);
};

export const handleGameProgressByUserAndSlotSave = async (
	ctx: MutationCtx,
	args: SaveGameProgressByUserAndSlotArgs,
): Promise<ProgressSaveResult> => {
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

		return createGameProgressSaveResult(existingProgress._id, savedAt);
	}

	const progressId = await ctx.db.insert("game_progress", {
		userId: args.userId,
		slot: args.slot,
		snapshot: args.snapshot,
		savedAt,
	});

	return createGameProgressSaveResult(progressId, savedAt);
};
