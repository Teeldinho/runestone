import { describe, expect, it } from "vitest";

import { USERNAME_RULES } from "../config";
import { isUsernameValid } from "./discriminator";
import { createSuggestedUsername } from "./guestUsername";

describe("createSuggestedUsername", () => {
	it("creates a username that satisfies the current username rules", () => {
		const username = createSuggestedUsername(() => 0);

		expect(isUsernameValid(username)).toBe(true);
		expect(username.length).toBeGreaterThanOrEqual(USERNAME_RULES.MIN_LENGTH);
		expect(username.length).toBeLessThanOrEqual(USERNAME_RULES.MAX_LENGTH);
	});

	it("uses the supplied random integer factory for generated parts", () => {
		const randomValues = [1, 2, 3, 4, 5, 6];
		let callIndex = 0;

		const username = createSuggestedUsername((maxExclusive) => {
			const value = randomValues[callIndex] ?? 0;
			callIndex += 1;

			return value % maxExclusive;
		});

		expect(username).toMatch(/^Rune_[A-Za-z]+[A-Za-z]+[A-Z2-9]{4}$/);
		expect(isUsernameValid(username)).toBe(true);
	});

	it("falls back to a deterministic valid username when generated values are invalid", () => {
		const username = createSuggestedUsername(() => Number.MAX_SAFE_INTEGER);

		expect(username).toBe("Rune_AshBearAAAA");
		expect(isUsernameValid(username)).toBe(true);
	});
});
