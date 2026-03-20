import type { AudioSpriteId } from "@/features/audio-manager/config";

export type AudioMachineState = "muted" | "playing" | "paused";

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
