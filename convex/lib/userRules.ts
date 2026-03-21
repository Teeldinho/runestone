import type { Doc } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import {
	BACKEND_ERROR_MESSAGES,
	DISCRIMINATOR_RULES,
	USERNAME_RULES,
} from "../config";

type PersistedUser = Pick<
	Doc<"users">,
	"_id" | "uuid" | "username" | "discriminator" | "createdAt" | "updatedAt"
>;

type UserProfile = {
	id: PersistedUser["_id"];
	uuid: string;
	username: string;
	discriminator: string;
	createdAt: number;
	updatedAt: number;
};

export const assertValidUsername = (username: string): void => {
	const hasValidLength =
		username.length >= USERNAME_RULES.MIN_LENGTH &&
		username.length <= USERNAME_RULES.MAX_LENGTH;

	if (!hasValidLength || !USERNAME_RULES.PATTERN.test(username)) {
		throw new Error(BACKEND_ERROR_MESSAGES.INVALID_USERNAME);
	}
};

export const formatDiscriminator = (value: number): string =>
	`${DISCRIMINATOR_RULES.PREFIX}${String(value).padStart(DISCRIMINATOR_RULES.PADDING, "0")}`;

export const findAvailableDiscriminator = async (
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

export const createUserProfile = (user: PersistedUser): UserProfile => ({
	id: user._id,
	uuid: user.uuid,
	username: user.username,
	discriminator: user.discriminator,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});

export type { PersistedUser, UserProfile };
