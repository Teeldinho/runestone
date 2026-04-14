import { USERNAME_RULES } from "../config";
import { USERNAME_PATTERN } from "./usernamePattern";

export const normalizeUsernameInput = (input: string): string => input.trim();

export const formatUserDisplayTag = (
	username: string,
	discriminator: string,
): string => `${username}${discriminator}`;

export const isUsernameValid = (username: string): boolean => {
	const normalizedUsername = normalizeUsernameInput(username);

	return (
		normalizedUsername.length >= USERNAME_RULES.MIN_LENGTH &&
		normalizedUsername.length <= USERNAME_RULES.MAX_LENGTH &&
		USERNAME_PATTERN.test(normalizedUsername)
	);
};
