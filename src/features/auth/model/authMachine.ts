import { assign, setup } from "xstate";

import {
	AUTH_CONTEXT_KEYS,
	AUTH_EVENTS,
	AUTH_INITIAL_CONTEXT,
	AUTH_MACHINE_ID,
	AUTH_STATUS,
} from "../config";

import { checkHasProfile } from "../lib";

import type { AuthMachineContext, AuthMachineEvent } from "./types";

export const authMachine = setup({
	types: {
		context: {} as AuthMachineContext,
		events: {} as AuthMachineEvent,
	},
}).createMachine({
	id: AUTH_MACHINE_ID,
	initial: AUTH_STATUS.CHECKING_SESSION,
	context: AUTH_INITIAL_CONTEXT as AuthMachineContext,
	on: {
		[AUTH_EVENTS.SESSION_BOOTSTRAPPED]: [
			{
				target: `.${AUTH_STATUS.AUTHENTICATED}`,
				guard: ({ event }) => checkHasProfile(event.profile),
				actions: assign(({ event }) => ({
					[AUTH_CONTEXT_KEYS.UUID]: event.uuid,
					[AUTH_CONTEXT_KEYS.PROFILE]: event.profile,
					[AUTH_CONTEXT_KEYS.PENDING_USERNAME]: null,
					[AUTH_CONTEXT_KEYS.ERROR_MESSAGE]: null,
				})),
			},
			{
				target: `.${AUTH_STATUS.REQUIRES_USERNAME}`,
				actions: assign(({ event }) => ({
					[AUTH_CONTEXT_KEYS.UUID]: event.uuid,
					[AUTH_CONTEXT_KEYS.PROFILE]: null,
					[AUTH_CONTEXT_KEYS.PENDING_USERNAME]: null,
					[AUTH_CONTEXT_KEYS.ERROR_MESSAGE]: null,
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
						[AUTH_CONTEXT_KEYS.PENDING_USERNAME]: event.username,
						[AUTH_CONTEXT_KEYS.ERROR_MESSAGE]: null,
					})),
				},
			},
		},
		[AUTH_STATUS.SUBMITTING_USERNAME]: {
			on: {
				[AUTH_EVENTS.USERNAME_SUBMIT_SUCCEEDED]: {
					target: AUTH_STATUS.AUTHENTICATED,
					actions: assign(({ event }) => ({
						[AUTH_CONTEXT_KEYS.PROFILE]: event.profile,
						[AUTH_CONTEXT_KEYS.PENDING_USERNAME]: null,
						[AUTH_CONTEXT_KEYS.ERROR_MESSAGE]: null,
					})),
				},
				[AUTH_EVENTS.USERNAME_SUBMIT_FAILED]: {
					target: AUTH_STATUS.REQUIRES_USERNAME,
					actions: assign(({ event }) => ({
						[AUTH_CONTEXT_KEYS.PENDING_USERNAME]: null,
						[AUTH_CONTEXT_KEYS.ERROR_MESSAGE]: event.errorMessage,
					})),
				},
			},
		},
		[AUTH_STATUS.AUTHENTICATED]: {
			on: {
				[AUTH_EVENTS.SIGN_OUT_REQUESTED]: {
					target: AUTH_STATUS.REQUIRES_USERNAME,
					actions: assign(() => ({
						[AUTH_CONTEXT_KEYS.PROFILE]: null,
						[AUTH_CONTEXT_KEYS.PENDING_USERNAME]: null,
						[AUTH_CONTEXT_KEYS.ERROR_MESSAGE]: null,
					})),
				},
			},
		},
	},
});
