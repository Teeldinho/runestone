import { afterEach, describe, expect, it, vi } from "vitest";

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
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns when browser storage is unavailable", () => {
		vi.stubGlobal("window", undefined as never);

		expect(() => requirePersistedAuthSession()).not.toThrowError();
	});

	it("throws when the persisted auth session is missing", () => {
		vi.stubGlobal("window", {
			localStorage: createMemoryStorage(),
		} as Window);

		expect(() => requirePersistedAuthSession()).toThrowError();
	});

	it("allows access when the persisted auth session exists", () => {
		vi.stubGlobal("window", {
			localStorage: createMemoryStorage({
				rs_uuid: "uuid",
				rs_username: "hero",
			}),
		} as Window);

		expect(() => requirePersistedAuthSession()).not.toThrowError();
	});
});
