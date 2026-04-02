import type {
	AudioEventType,
	AudioMachineStateValue,
	AudioSpriteId,
} from "@/features/audio-manager/config";

export type AudioMachineState = AudioMachineStateValue;

export type AudioSettings = {
	masterVolume: number;
	musicVolume: number;
	sfxVolume: number;
	isMuted: boolean;
};

export type AudioCue = {
	id: AudioSpriteId;
	loop?: boolean;
};

export type AudioMachineContext = {
	settings: AudioSettings;
	lastAudibleState: Exclude<AudioMachineState, "muted">;
};

export type AudioMachineEvent = {
	type: AudioEventType;
};
