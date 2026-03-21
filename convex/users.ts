import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { BACKEND_ERROR_MESSAGES } from "./config";
import {
	assertValidUsername,
	createUserProfile,
	findAvailableDiscriminator,
} from "./lib/userRules";

export const getByUuid = query({
	args: {
		uuid: v.string(),
	},
	handler: async (ctx, args) => {
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_uuid", (indexQuery) => indexQuery.eq("uuid", args.uuid))
			.unique();

		if (!existingUser) {
			return null;
		}

		return createUserProfile(existingUser);
	},
});

export const createOrGet = mutation({
	args: {
		uuid: v.string(),
		username: v.string(),
	},
	handler: async (ctx, args) => {
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_uuid", (indexQuery) => indexQuery.eq("uuid", args.uuid))
			.unique();

		if (existingUser) {
			return createUserProfile(existingUser);
		}

		assertValidUsername(args.username);

		const discriminator = await findAvailableDiscriminator(ctx, args.username);
		const timestamp = Date.now();

		const createdUserId = await ctx.db.insert("users", {
			uuid: args.uuid,
			username: args.username,
			discriminator,
			createdAt: timestamp,
			updatedAt: timestamp,
		});

		const createdUser = await ctx.db.get(createdUserId);

		if (!createdUser) {
			throw new Error(BACKEND_ERROR_MESSAGES.USER_CREATION_FAILED);
		}

		return createUserProfile(createdUser);
	},
});
