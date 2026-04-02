import type { MutationCtx, QueryCtx } from "../_generated/server";
import { BACKEND_ERROR_MESSAGES, DISCRIMINATOR_RULES } from "../config";
import {
	assertValidUsername,
	createUserProfile,
	formatDiscriminator,
} from "../lib/userRules";
import type {
	CreateOrGetUserProfileByUuidArgs,
	GetUserProfileByUuidArgs,
	UserProfile,
} from "../model/userTypes";

const findAvailableUserDiscriminator = async (
	ctx: MutationCtx,
	username: string,
): Promise<string> => {
	for (
		let candidate = DISCRIMINATOR_RULES.START;
		candidate <= DISCRIMINATOR_RULES.LIMIT;
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

	throw new Error(BACKEND_ERROR_MESSAGES.DISCRIMINATOR_EXHAUSTED);
};

export const handleUserProfileByUuidGet = async (
	ctx: QueryCtx,
	args: GetUserProfileByUuidArgs,
): Promise<UserProfile | null> => {
	const existingUser = await ctx.db
		.query("users")
		.withIndex("by_uuid", (indexQuery) => indexQuery.eq("uuid", args.uuid))
		.unique();

	if (!existingUser) {
		return null;
	}

	return createUserProfile(existingUser);
};

export const handleUserProfileByUuidCreateOrGet = async (
	ctx: MutationCtx,
	args: CreateOrGetUserProfileByUuidArgs,
): Promise<UserProfile> => {
	const existingUser = await ctx.db
		.query("users")
		.withIndex("by_uuid", (indexQuery) => indexQuery.eq("uuid", args.uuid))
		.unique();

	if (existingUser) {
		return createUserProfile(existingUser);
	}

	assertValidUsername(args.username);

	const discriminator = await findAvailableUserDiscriminator(
		ctx,
		args.username,
	);
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
};
