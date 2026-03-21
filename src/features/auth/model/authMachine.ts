import { assign, setup } from "xstate";

import { AUTH_EVENTS, AUTH_MACHINE_ID, AUTH_STATUS } from "../config";

import type { AuthMachineContext, AuthMachineEvent } from "./types";

const INITIAL_AUTH_CONTEXT: AuthMachineContext = {
	uuid: "",
	profile: null,
	pendingUsername: null,
	errorMessage: null,
};

export const authMachine = setup({
	types: {
		context: {} as AuthMachineContext,
		events: {} as AuthMachineEvent,
	},
}).createMachine({
	id: AUTH_MACHINE_ID,
	initial: AUTH_STATUS.CHECKING_SESSION,
	context: INITIAL_AUTH_CONTEXT,
	on: {
		[AUTH_EVENTS.SESSION_BOOTSTRAPPED]: [
			{
				target: `.${AUTH_STATUS.AUTHENTICATED}`,
				guard: ({ event }) => Boolean(event.profile),
				actions: assign(({ event }) => ({
					uuid: event.uuid,
					profile: event.profile,
					pendingUsername: null,
					errorMessage: null,
				})),
			},
			{
				target: `.${AUTH_STATUS.REQUIRES_USERNAME}`,
				actions: assign(({ event }) => ({
					uuid: event.uuid,
					profile: null,
					pendingUsername: null,
					errorMessage: null,
				})),
			},
		],
	},
	states: {
		[AUTH_STATUS.CHECKING_SESSION]: {},
		[AUTH_STATUS.REQUIRES_USERNAME]: {
			on: {
				[AUTH_EVENTS.USERNAME_SUBMIT_REQUESTED]: {
					target: AUTH_STATUS.SUBMITTING_USERNAME,
					actions: assign(({ event }) => ({
						pendingUsername: event.username,
						errorMessage: null,
					})),
				},
			},
		},
		[AUTH_STATUS.SUBMITTING_USERNAME]: {
			on: {
				[AUTH_EVENTS.USERNAME_SUBMIT_SUCCEEDED]: {
					target: AUTH_STATUS.AUTHENTICATED,
					actions: assign(({ event }) => ({
						profile: event.profile,
						pendingUsername: null,
						errorMessage: null,
					})),
				},
				[AUTH_EVENTS.USERNAME_SUBMIT_FAILED]: {
					target: AUTH_STATUS.REQUIRES_USERNAME,
					actions: assign(({ event }) => ({
						pendingUsername: null,
						errorMessage: event.errorMessage,
					})),
				},
			},
		},
		[AUTH_STATUS.AUTHENTICATED]: {
			on: {
				[AUTH_EVENTS.SIGN_OUT_REQUESTED]: {
					target: AUTH_STATUS.REQUIRES_USERNAME,
					actions: assign(() => ({
						profile: null,
						pendingUsername: null,
						errorMessage: null,
					})),
				},
			},
		},
	},
});
