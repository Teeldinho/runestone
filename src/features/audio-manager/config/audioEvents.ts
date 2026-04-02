export const AUDIO_MACHINE_ID = "audioMachine";

export const AUDIO_MACHINE_STATES = {
	MUTED: "muted",
	PLAYING: "playing",
	PAUSED: "paused",
} as const;

export const AUDIO_EVENTS = {
	PLAY_REQUESTED: "PLAY_REQUESTED",
	PAUSE_REQUESTED: "PAUSE_REQUESTED",
	STOP_REQUESTED: "STOP_REQUESTED",
	MUTE_REQUESTED: "MUTE_REQUESTED",
	UNMUTE_REQUESTED: "UNMUTE_REQUESTED",
	TOGGLE_MUTE_REQUESTED: "TOGGLE_MUTE_REQUESTED",
} as const;

export type AudioMachineStateValue =
	(typeof AUDIO_MACHINE_STATES)[keyof typeof AUDIO_MACHINE_STATES];

export type AudioEventType = (typeof AUDIO_EVENTS)[keyof typeof AUDIO_EVENTS];
