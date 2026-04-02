import { describe, expect, it } from "vitest";

import type { UserProfile } from "@/entities/user";

import { checkHasProfile } from "./authMachineGuards";

describe("checkHasProfile", () => {
	it("returns true when a profile object is provided", () => {
		const profile = { username: "dungeon_runner" } as UserProfile;
		expect(checkHasProfile(profile)).toBe(true);
	});

	it("returns false when profile is null", () => {
		expect(checkHasProfile(null)).toBe(false);
	});

	it("returns false when profile is undefined", () => {
		expect(checkHasProfile(undefined)).toBe(false);
	});
});
