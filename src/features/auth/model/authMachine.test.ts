import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import { AUTH_EVENTS, AUTH_STATUS } from "../config";
import { authMachine } from "./authMachine";

const AUTHENTICATED_PROFILE_FIXTURE = {
	id: "user_123",
	uuid: "session-uuid",
	username: "runestone_hero",
	discriminator: "#0001",
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
});
