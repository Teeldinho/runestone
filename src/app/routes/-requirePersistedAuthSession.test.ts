import { describe, expect, it } from "vitest";

import { requirePersistedAuthSession } from "./-requirePersistedAuthSession";

type MemoryStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const createMemoryStorage = (
	initialEntries: Record<string, string> = {},
): MemoryStorage => {
	const values = new Map(Object.entries(initialEntries));

	return {
		getItem: (key) => values.get(key) ?? null,
		setItem: (key, value) => {
			values.set(key, value);
		},
		removeItem: (key) => {
			values.delete(key);
		},
	};
};

describe("requirePersistedAuthSession", () => {
	it("throws when the persisted auth session is missing", () => {
		expect(() =>
			requirePersistedAuthSession(createMemoryStorage() as Storage),
		).toThrowError();
	});

	it("allows access when the persisted auth session exists", () => {
		expect(() =>
			requirePersistedAuthSession(
				createMemoryStorage({
					rs_uuid: "uuid",
					rs_username: "hero",
				}) as Storage,
			),
		).not.toThrowError();
	});
});
