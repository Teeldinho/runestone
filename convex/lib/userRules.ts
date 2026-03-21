import {
	BACKEND_ERROR_MESSAGES,
	DISCRIMINATOR_RULES,
	USERNAME_RULES,
} from "../config";
import type { PersistedUser, UserProfile } from "../model/userTypes";

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

export const createUserProfile = (user: PersistedUser): UserProfile => ({
	id: user._id,
	uuid: user.uuid,
	username: user.username,
	discriminator: user.discriminator,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});
