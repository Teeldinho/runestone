import { assign, setup } from "xstate";

import {
	AUDIO_DEFAULTS,
	AUDIO_EVENTS,
	AUDIO_MACHINE_ID,
	AUDIO_MACHINE_STATES,
} from "../config";

import type {
	AudioMachineContext,
	AudioMachineEvent,
	AudioSettings,
} from "./types";

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
	masterVolume: AUDIO_DEFAULTS.MASTER_VOLUME,
	musicVolume: AUDIO_DEFAULTS.MUSIC_VOLUME,
	sfxVolume: AUDIO_DEFAULTS.SFX_VOLUME,
	isMuted: false,
};

const INITIAL_AUDIO_CONTEXT: AudioMachineContext = {
	settings: DEFAULT_AUDIO_SETTINGS,
	lastAudibleState: AUDIO_MACHINE_STATES.PAUSED,
};

const getMutedAudioContext = (
	context: AudioMachineContext,
): AudioMachineContext => ({
	settings: {
		...context.settings,
		isMuted: true,
	},
	lastAudibleState:
		context.lastAudibleState === AUDIO_MACHINE_STATES.PLAYING
			? AUDIO_MACHINE_STATES.PLAYING
			: AUDIO_MACHINE_STATES.PAUSED,
});

const getUnmutedAudioContext = (
	context: AudioMachineContext,
): Partial<AudioMachineContext> => ({
	settings: {
		...context.settings,
		isMuted: false,
	},
});

export const audioMachine = setup({
	types: {
		context: {} as AudioMachineContext,
		events: {} as AudioMachineEvent,
	},
}).createMachine({
	id: AUDIO_MACHINE_ID,
	initial: AUDIO_MACHINE_STATES.PAUSED,
	context: INITIAL_AUDIO_CONTEXT,
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
					actions: assign(({ context }) => getMutedAudioContext(context)),
				},
				[AUDIO_EVENTS.TOGGLE_MUTE_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.MUTED,
					actions: assign(({ context }) => getMutedAudioContext(context)),
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
					actions: assign(({ context }) => getMutedAudioContext(context)),
				},
				[AUDIO_EVENTS.TOGGLE_MUTE_REQUESTED]: {
					target: AUDIO_MACHINE_STATES.MUTED,
					actions: assign(({ context }) => getMutedAudioContext(context)),
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
						guard: ({ context }) =>
							context.lastAudibleState === AUDIO_MACHINE_STATES.PLAYING,
						actions: assign(({ context }) => getUnmutedAudioContext(context)),
					},
					{
						target: AUDIO_MACHINE_STATES.PAUSED,
						actions: assign(({ context }) => getUnmutedAudioContext(context)),
					},
				],
				[AUDIO_EVENTS.TOGGLE_MUTE_REQUESTED]: [
					{
						target: AUDIO_MACHINE_STATES.PLAYING,
						guard: ({ context }) =>
							context.lastAudibleState === AUDIO_MACHINE_STATES.PLAYING,
						actions: assign(({ context }) => getUnmutedAudioContext(context)),
					},
					{
						target: AUDIO_MACHINE_STATES.PAUSED,
						actions: assign(({ context }) => getUnmutedAudioContext(context)),
					},
				],
			},
		},
	},
});
