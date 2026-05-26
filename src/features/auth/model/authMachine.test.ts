import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import { AUTH_EVENTS, AUTH_STATUS } from "../config";
import { authMachine } from "./authMachine";

const AUTHENTICATED_PROFILE_FIXTURE = {
	id: "user_123",
	uuid: "session-uuid",
	username: "runestone_hero",
	discriminator: "D0001",
	createdAt: 1,
	updatedAt: 1,
} as const;

describe("authMachine", () => {
	it("moves from session bootstrap to requires username when no profile exists", () => {
		const actor = createActor(authMachine).start();

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: "session-uuid",
			profile: null,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.REQUIRES_USERNAME);
		expect(actor.getSnapshot().context.uuid).toBe("session-uuid");
	});

	it("moves to authenticated when session bootstrap includes profile", () => {
		const actor = createActor(authMachine).start();

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: "session-uuid",
			profile: AUTHENTICATED_PROFILE_FIXTURE,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.AUTHENTICATED);
		expect(actor.getSnapshot().context.profile).toEqual(
			AUTHENTICATED_PROFILE_FIXTURE,
		);
	});

	it("moves to bootstrap failed when the session query errors without a profile", () => {
		const actor = createActor(authMachine).start();

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAP_FAILED,
			uuid: "session-uuid",
			errorMessage: "Convex unreachable",
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.BOOTSTRAP_FAILED);
		expect(actor.getSnapshot().context.uuid).toBe("session-uuid");
		expect(actor.getSnapshot().context.errorMessage).toBe("Convex unreachable");

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: "session-uuid",
			profile: null,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.REQUIRES_USERNAME);
		expect(actor.getSnapshot().context.errorMessage).toBeNull();
	});

	it("returns to checking session when bootstrap retry is requested", () => {
		const actor = createActor(authMachine).start();

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAP_FAILED,
			uuid: "session-uuid",
			errorMessage: "Convex unreachable",
		});

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAP_RETRY_REQUESTED,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.CHECKING_SESSION);
		expect(actor.getSnapshot().context.uuid).toBe("session-uuid");
		expect(actor.getSnapshot().context.profile).toBeNull();
		expect(actor.getSnapshot().context.errorMessage).toBeNull();
	});

	it("handles username submit success path", () => {
		const actor = createActor(authMachine).start();

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: "session-uuid",
			profile: null,
		});
		actor.send({
			type: AUTH_EVENTS.USERNAME_SUBMIT_REQUESTED,
			username: "runestone_hero",
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.SUBMITTING_USERNAME);

		actor.send({
			type: AUTH_EVENTS.USERNAME_SUBMIT_SUCCEEDED,
			profile: AUTHENTICATED_PROFILE_FIXTURE,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.AUTHENTICATED);
		expect(actor.getSnapshot().context.profile).toEqual(
			AUTHENTICATED_PROFILE_FIXTURE,
		);
	});

	it("returns to requires username when submit fails", () => {
		const actor = createActor(authMachine).start();

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: "session-uuid",
			profile: null,
		});
		actor.send({
			type: AUTH_EVENTS.USERNAME_SUBMIT_REQUESTED,
			username: "runestone_hero",
		});
		actor.send({
			type: AUTH_EVENTS.USERNAME_SUBMIT_FAILED,
			errorMessage: "unable to create user",
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.REQUIRES_USERNAME);
		expect(actor.getSnapshot().context.errorMessage).toBe(
			"unable to create user",
		);
	});

	it("defers and reopens the username entry without authenticating", () => {
		const actor = createActor(authMachine).start();

		actor.send({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: "session-uuid",
			profile: null,
		});
		actor.send({
			type: AUTH_EVENTS.USERNAME_ENTRY_DEFERRED,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.REQUIRES_USERNAME);
		expect(actor.getSnapshot().context.profile).toBeNull();
		expect(actor.getSnapshot().context.isUsernameEntryDeferred).toBe(true);

		actor.send({
			type: AUTH_EVENTS.USERNAME_ENTRY_REQUESTED,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.REQUIRES_USERNAME);
		expect(actor.getSnapshot().context.isUsernameEntryDeferred).toBe(false);
	});

	it("can request username entry while session bootstrap is still checking", () => {
		const actor = createActor(authMachine).start();

		actor.send({
			type: AUTH_EVENTS.USERNAME_ENTRY_REQUESTED,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.CHECKING_SESSION);
		expect(actor.getSnapshot().context.isUsernameEntryRequested).toBe(true);
		expect(actor.getSnapshot().context.isUsernameEntryDeferred).toBe(false);

		actor.send({
			type: AUTH_EVENTS.USERNAME_ENTRY_DEFERRED,
		});

		expect(actor.getSnapshot().value).toBe(AUTH_STATUS.CHECKING_SESSION);
		expect(actor.getSnapshot().context.isUsernameEntryRequested).toBe(false);
		expect(actor.getSnapshot().context.isUsernameEntryDeferred).toBe(true);
	});
});
