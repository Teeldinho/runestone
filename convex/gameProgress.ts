import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import {
	handleGameProgressByUserAndSlotGet,
	handleGameProgressByUserAndSlotSave,
} from "./api/gameProgressApi";

export const getGameProgressByUserAndSlot = query({
	args: {
		userId: v.id("users"),
		slot: v.number(),
	},
	handler: handleGameProgressByUserAndSlotGet,
});

export const saveGameProgressByUserAndSlot = mutation({
	args: {
		userId: v.id("users"),
		slot: v.number(),
		snapshot: v.string(),
	},
	handler: handleGameProgressByUserAndSlotSave,
});
