import { describe, expect, it, vi } from "vitest";

import {
	clearPersistedUsername,
	ensureSessionUuid,
	hasPersistedAuthSession,
	readPersistedUsername,
	readSessionUuid,
	writePersistedUsername,
} from "./sessionStorage";

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

describe("sessionStorage utilities", () => {
	it("returns existing session uuid without generating one", () => {
		const storage = createMemoryStorage({ rs_uuid: "existing-uuid" });
		const createUuid = vi.fn(() => "new-uuid");

		expect(ensureSessionUuid(storage, createUuid)).toBe("existing-uuid");
		expect(createUuid).not.toHaveBeenCalled();
		expect(readSessionUuid(storage)).toBe("existing-uuid");
	});

	it("creates and stores a session uuid when missing", () => {
		const storage = createMemoryStorage();

		expect(ensureSessionUuid(storage, () => "generated-uuid")).toBe(
			"generated-uuid",
		);
		expect(readSessionUuid(storage)).toBe("generated-uuid");
	});

	it("persists and clears username values", () => {
		const storage = createMemoryStorage();

		writePersistedUsername(storage, "runestone_hero");
		expect(readPersistedUsername(storage)).toBe("runestone_hero");

		clearPersistedUsername(storage);
		expect(readPersistedUsername(storage)).toBeNull();
	});

	it("derives persisted auth availability from uuid and username", () => {
		const unauthenticatedStorage = createMemoryStorage();
		expect(hasPersistedAuthSession(unauthenticatedStorage)).toBe(false);

		const authenticatedStorage = createMemoryStorage({
			rs_uuid: "uuid",
			rs_username: "hero",
		});
		expect(hasPersistedAuthSession(authenticatedStorage)).toBe(true);
	});
});
