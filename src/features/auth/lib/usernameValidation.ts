import { z } from "zod";

import { AUTH_COPY, USERNAME_RULES } from "../config";
import { USERNAME_PATTERN } from "./usernamePattern";

const usernameSchema = z
	.string()
	.trim()
	.min(USERNAME_RULES.MIN_LENGTH)
	.max(USERNAME_RULES.MAX_LENGTH)
	.regex(USERNAME_PATTERN);

export const getUsernameValidationError = (
	username: string,
): string | undefined => {
	const validationResult = usernameSchema.safeParse(username);

	if (validationResult.success) {
		return undefined;
	}

	return AUTH_COPY.USERNAME_VALIDATION_ERROR;
};
