import { describe, expect, it } from "vitest";

import { AUTH_COPY } from "../config";

import { getUsernameValidationError } from "./usernameValidation";

describe("getUsernameValidationError", () => {
	it("returns configured validation copy for invalid usernames", () => {
		expect(getUsernameValidationError("ab")).toBe(
			AUTH_COPY.USERNAME_VALIDATION_ERROR,
		);
	});

	it("returns undefined for valid usernames", () => {
		expect(getUsernameValidationError("runestone_hero")).toBeUndefined();
	});
});
