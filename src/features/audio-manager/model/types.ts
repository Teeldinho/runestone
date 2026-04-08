import type {
	AudioEventType,
	AudioMachineStateValue,
} from "@/features/audio-manager/config";

export type AudioMachineState = AudioMachineStateValue;

export type AudioSettings = {
	masterVolume: number;
	musicVolume: number;
	isMuted: boolean;
};

export type AudioMachineContext = {
	settings: AudioSettings;
	lastAudibleState: Exclude<AudioMachineState, "muted">;
};

export type AudioMachineEvent = {
	type: AudioEventType;
};
