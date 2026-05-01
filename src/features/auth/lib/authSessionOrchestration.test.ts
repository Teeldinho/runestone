import { afterEach, describe, expect, it, vi } from "vitest";

import type { UserProfile } from "@/entities/user";

import { AUTH_ERROR_MESSAGES, AUTH_EVENTS } from "../config";

import {
	getAuthClientStorage,
	resolveAuthSubmitErrorMessage,
	resolveSessionBootstrapEvent,
	resolveSessionBootstrapFailureEvent,
	submitAuthUsername,
} from "./authSessionOrchestration";
import { readPersistedUsername } from "./sessionStorage";

type MemoryStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const TEST_USER_PROFILE: UserProfile = {
	id: "user-1",
	uuid: "uuid-1",
	username: "runestone_hero",
	discriminator: "0001",
	createdAt: 1,
	updatedAt: 1,
};

const createMemoryStorage = (): MemoryStorage => {
	const storageValues = new Map<string, string>();

	return {
		getItem: (key) => storageValues.get(key) ?? null,
		setItem: (key, value) => {
			storageValues.set(key, value);
		},
		removeItem: (key) => {
			storageValues.delete(key);
		},
	};
};

describe("authSessionOrchestration", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("resolves bootstrap events only when session uuid is ready", () => {
		expect(
			resolveSessionBootstrapEvent({
				sessionUuid: null,
				isProfileQueryPending: false,
				profile: TEST_USER_PROFILE,
			}),
		).toBeNull();

		expect(
			resolveSessionBootstrapEvent({
				sessionUuid: "uuid-1",
				isProfileQueryPending: true,
				profile: TEST_USER_PROFILE,
			}),
		).toBeNull();

		expect(
			resolveSessionBootstrapEvent({
				sessionUuid: "uuid-1",
				isProfileQueryPending: false,
				profile: undefined,
			}),
		).toEqual({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: "uuid-1",
			profile: null,
		});
	});

	it("resolves bootstrap failure events when the query errors before a profile exists", () => {
		expect(
			resolveSessionBootstrapFailureEvent({
				sessionUuid: null,
				isProfileQueryPending: false,
				isProfileQueryError: true,
				error: new Error("Convex unreachable"),
				profile: null,
			}),
		).toBeNull();

		expect(
			resolveSessionBootstrapFailureEvent({
				sessionUuid: "uuid-1",
				isProfileQueryPending: true,
				isProfileQueryError: true,
				error: new Error("Convex unreachable"),
				profile: null,
			}),
		).toBeNull();

		expect(
			resolveSessionBootstrapFailureEvent({
				sessionUuid: "uuid-1",
				isProfileQueryPending: false,
				isProfileQueryError: true,
				error: new Error("Convex unreachable"),
				profile: null,
			}),
		).toEqual({
			type: AUTH_EVENTS.SESSION_BOOTSTRAP_FAILED,
			uuid: "uuid-1",
			errorMessage: "Convex unreachable",
		});

		expect(
			resolveSessionBootstrapFailureEvent({
				sessionUuid: "uuid-1",
				isProfileQueryPending: false,
				isProfileQueryError: true,
				error: "Convex unreachable",
				profile: null,
			}),
		).toEqual({
			type: AUTH_EVENTS.SESSION_BOOTSTRAP_FAILED,
			uuid: "uuid-1",
			errorMessage: AUTH_ERROR_MESSAGES.SESSION_BOOTSTRAP_FAILED,
		});
	});

	it("submits username and dispatches requested then success events", async () => {
		const sendAuthEvent = vi.fn();
		const createUser = vi.fn().mockResolvedValue(TEST_USER_PROFILE);
		const storage = createMemoryStorage();

		await submitAuthUsername({
			username: "  runestone_hero  ",
			sessionUuid: "uuid-1",
			createUser,
			storage: storage as Storage,
			sendAuthEvent,
		});

		expect(createUser).toHaveBeenCalledWith({
			uuid: "uuid-1",
			username: "runestone_hero",
		});
		expect(sendAuthEvent).toHaveBeenNthCalledWith(1, {
			type: AUTH_EVENTS.USERNAME_SUBMIT_REQUESTED,
			username: "runestone_hero",
		});
		expect(sendAuthEvent).toHaveBeenNthCalledWith(2, {
			type: AUTH_EVENTS.USERNAME_SUBMIT_SUCCEEDED,
			profile: TEST_USER_PROFILE,
		});
		expect(readPersistedUsername(storage)).toBe("runestone_hero");
	});

	it("dispatches failure event when create-user mutation rejects", async () => {
		const sendAuthEvent = vi.fn();
		const createUser = vi.fn().mockRejectedValue(new Error("Create failed"));

		await submitAuthUsername({
			username: "runestone_hero",
			sessionUuid: "uuid-1",
			createUser,
			storage: null,
			sendAuthEvent,
		});

		expect(sendAuthEvent).toHaveBeenNthCalledWith(1, {
			type: AUTH_EVENTS.USERNAME_SUBMIT_REQUESTED,
			username: "runestone_hero",
		});
		expect(sendAuthEvent).toHaveBeenNthCalledWith(2, {
			type: AUTH_EVENTS.USERNAME_SUBMIT_FAILED,
			errorMessage: "Create failed",
		});
	});

	it("no-ops username submit when session uuid is not available", async () => {
		const sendAuthEvent = vi.fn();
		const createUser = vi.fn();

		await submitAuthUsername({
			username: "runestone_hero",
			sessionUuid: null,
			createUser,
			storage: null,
			sendAuthEvent,
		});

		expect(createUser).not.toHaveBeenCalled();
		expect(sendAuthEvent).not.toHaveBeenCalled();
	});

	it("resolves auth submit fallback error message", () => {
		expect(resolveAuthSubmitErrorMessage(new Error("Boom"))).toBe("Boom");
		expect(resolveAuthSubmitErrorMessage("Boom")).toBe(
			AUTH_ERROR_MESSAGES.USERNAME_SUBMIT_FAILED,
		);
	});

	it("reads localStorage from browser global when available", () => {
		const storage = createMemoryStorage();

		vi.stubGlobal("window", {
			localStorage: storage,
		} as unknown as Window);

		expect(getAuthClientStorage()).toBe(storage);
	});
});
