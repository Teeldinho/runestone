import { assign, setup } from "xstate";

import {
	AUDIO_EVENTS,
	AUDIO_INITIAL_CONTEXT,
	AUDIO_MACHINE_ID,
	AUDIO_MACHINE_STATES,
} from "../config";
import {
	createMutedAudioContext,
	createUnmutedAudioContext,
} from "../lib/audioMachineContext";
import { checkWasPlaying } from "../lib/audioMachineGuards";

import type { AudioMachineContext, AudioMachineEvent } from "./types";

export const audioMachine = setup({
	types: {
		context: {} as AudioMachineContext,
		events: {} as AudioMachineEvent,
	},
}).createMachine({
	id: AUDIO_MACHINE_ID,
	initial: AUDIO_MACHINE_STATES.PAUSED,
	context: AUDIO_INITIAL_CONTEXT as AudioMachineContext,
	states: {
		[AUDIO_MACHINE_STATES.PAUSED]: {
			on: {
				[AUDIO_EVENTS.PLAY_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.PLAYING,
					actions: assign(() => ({
						lastAudibleState: AUDIO_MACHINE_STATES.PLAYING,
					})),
				},
				[AUDIO_EVENTS.MUTE_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.MUTED,
					actions: assign(({ context }) => createMutedAudioContext(context)),
				},
				[AUDIO_EVENTS.TOGGLE_MUTE_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.MUTED,
					actions: assign(({ context }) => createMutedAudioContext(context)),
				},
			},
		},
		[AUDIO_MACHINE_STATES.PLAYING]: {
			on: {
				[AUDIO_EVENTS.PAUSE_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.PAUSED,
					actions: assign(() => ({
						lastAudibleState: AUDIO_MACHINE_STATES.PAUSED,
					})),
				},
				[AUDIO_EVENTS.STOP_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.PAUSED,
					actions: assign(() => ({
						lastAudibleState: AUDIO_MACHINE_STATES.PAUSED,
					})),
				},
				[AUDIO_EVENTS.MUTE_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.MUTED,
					actions: assign(({ context }) => createMutedAudioContext(context)),
				},
				[AUDIO_EVENTS.TOGGLE_MUTE_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.MUTED,
					actions: assign(({ context }) => createMutedAudioContext(context)),
				},
			},
		},
		[AUDIO_MACHINE_STATES.MUTED]: {
			on: {
				[AUDIO_EVENTS.PLAY_REQUESTED]: {
					actions: assign(() => ({
						lastAudibleState: AUDIO_MACHINE_STATES.PLAYING,
					})),
				},
				[AUDIO_EVENTS.PAUSE_REQUESTED]: {
					actions: assign(() => ({
						lastAudibleState: AUDIO_MACHINE_STATES.PAUSED,
					})),
				},
				[AUDIO_EVENTS.UNMUTE_REQUESTED]: [
					{
						target: AUDIO_MACHINE_STATES.PLAYING,
						guard: ({ context }) => checkWasPlaying(context.lastAudibleState),
						actions: assign(({ context }) =>
							createUnmutedAudioContext(context),
						),
					},
					{
						target: AUDIO_MACHINE_STATES.PAUSED,
						actions: assign(({ context }) =>
							createUnmutedAudioContext(context),
						),
					},
				],
				[AUDIO_EVENTS.TOGGLE_MUTE_REQUESTED]: [
					{
						target: AUDIO_MACHINE_STATES.PLAYING,
						guard: ({ context }) => checkWasPlaying(context.lastAudibleState),
						actions: assign(({ context }) =>
							createUnmutedAudioContext(context),
						),
					},
					{
						target: AUDIO_MACHINE_STATES.PAUSED,
						actions: assign(({ context }) =>
							createUnmutedAudioContext(context),
						),
					},
				],
			},
		},
	},
});
