import * as Tone from "tone";

import { AUDIO_DEFAULTS, AUDIO_PATHS } from "../config";

let backgroundMusicPlayer: Tone.Player | null = null;

const getBackgroundMusicPlayer = (): Tone.Player => {
	if (!backgroundMusicPlayer) {
		backgroundMusicPlayer = new Tone.Player({
			autostart: false,
			loop: AUDIO_DEFAULTS.MUSIC_LOOP,
			url: AUDIO_PATHS.MUSIC,
		});
		backgroundMusicPlayer.toDestination();
		backgroundMusicPlayer.volume.value = AUDIO_DEFAULTS.MUSIC_VOLUME;
	}

	return backgroundMusicPlayer;
};

export const startBackgroundMusicLoop = async (): Promise<void> => {
	await Tone.start();
	Tone.Transport.start();
	getBackgroundMusicPlayer().start();
};

export const pauseBackgroundMusicLoop = (): void => {
	Tone.Transport.pause();
	getBackgroundMusicPlayer().stop();
};

export const stopBackgroundMusicLoop = (): void => {
	Tone.Transport.stop();
	getBackgroundMusicPlayer().stop();
};

export const setBackgroundMusicVolume = (volume: number): void => {
	getBackgroundMusicPlayer().volume.value = volume;
};

export const disposeMusicManager = (): void => {
	if (!backgroundMusicPlayer) {
		return;
	}

	backgroundMusicPlayer.dispose();
	backgroundMusicPlayer = null;
};
