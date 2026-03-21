import { describe, expect, it } from "vitest";

import {
	formatUserDisplayTag,
	isUsernameValid,
	normalizeUsernameInput,
} from "./discriminator";

describe("discriminator utilities", () => {
	it("trims whitespace around username input", () => {
		expect(normalizeUsernameInput("  runestone_hero  ")).toBe("runestone_hero");
	});

	it("formats user display tag from username and discriminator", () => {
		expect(formatUserDisplayTag("Knight", "#0042")).toBe("Knight#0042");
	});

	it("validates username boundaries and allowed characters", () => {
		expect(isUsernameValid("ab")).toBe(false);
		expect(isUsernameValid("username-with-dash")).toBe(false);
		expect(isUsernameValid("runestone_hero")).toBe(true);
	});
});
