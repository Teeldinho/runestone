import { z } from "zod";

import { USERNAME_RULES } from "../config";

const usernameSchema = z
	.string()
	.trim()
	.min(USERNAME_RULES.MIN_LENGTH)
	.max(USERNAME_RULES.MAX_LENGTH)
	.regex(USERNAME_RULES.PATTERN);

export const getUsernameValidationError = (
	username: string,
): string | undefined => {
	const validationResult = usernameSchema.safeParse(username);

	if (validationResult.success) {
		return undefined;
	}

	return "Use 3-20 letters, numbers, or underscores.";
};
