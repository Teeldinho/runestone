import { v } from "convex/values";

import { type MutationCtx, mutation, query } from "./_generated/server";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

const DISCRIMINATOR_PREFIX = "#";
const DISCRIMINATOR_PADDING = 4;
const DISCRIMINATOR_START = 1;
const DISCRIMINATOR_LIMIT = 9999;

const INVALID_USERNAME_ERROR =
	"Username must be 3-20 characters and contain only letters, numbers, or underscores.";
const DISCRIMINATOR_EXHAUSTED_ERROR =
	"No discriminator slots available for this username.";

const assertValidUsername = (username: string): void => {
	const hasValidLength =
		username.length >= USERNAME_MIN_LENGTH &&
		username.length <= USERNAME_MAX_LENGTH;

	if (!hasValidLength || !USERNAME_PATTERN.test(username)) {
		throw new Error(INVALID_USERNAME_ERROR);
	}
};

const formatDiscriminator = (value: number): string =>
	`${DISCRIMINATOR_PREFIX}${String(value).padStart(DISCRIMINATOR_PADDING, "0")}`;

const toUserProfile = (user: {
	_id: string;
	uuid: string;
	username: string;
	discriminator: string;
	createdAt: number;
	updatedAt: number;
}) => ({
	id: user._id,
	uuid: user.uuid,
	username: user.username,
	discriminator: user.discriminator,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});

const findAvailableDiscriminator = async (
	ctx: MutationCtx,
	username: string,
): Promise<string> => {
	for (
		let candidate = DISCRIMINATOR_START;
		candidate <= DISCRIMINATOR_LIMIT;
		candidate += 1
	) {
		const discriminator = formatDiscriminator(candidate);
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_username_and_discriminator", (indexQuery) =>
				indexQuery.eq("username", username).eq("discriminator", discriminator),
			)
			.unique();

		if (!existingUser) {
			return discriminator;
		}
	}

	throw new Error(DISCRIMINATOR_EXHAUSTED_ERROR);
};

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

		return toUserProfile(existingUser);
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
			return toUserProfile(existingUser);
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
			throw new Error("User creation failed.");
		}

		return toUserProfile(createdUser);
	},
});
