import * as Tone from "tone";

import { AUDIO_DEFAULTS, AUDIO_PATHS } from "../config";

let backgroundMusicPlayer: Tone.Player | null = null;
let isMusicStarted = false;

const initBackgroundMusicPlayer = async (): Promise<Tone.Player> => {
	if (!backgroundMusicPlayer) {
		// Explicitly load and decode buffer first
		const buffer = new Tone.Buffer(AUDIO_PATHS.MUSIC);
		await buffer.loaded;

		// Create player with pre-loaded buffer — no async loading needed
		backgroundMusicPlayer = new Tone.Player(buffer);
		backgroundMusicPlayer.loop = AUDIO_DEFAULTS.MUSIC_LOOP;
		backgroundMusicPlayer.toDestination();
		backgroundMusicPlayer.volume.value = AUDIO_DEFAULTS.MUSIC_VOLUME;
	}

	return backgroundMusicPlayer;
};

export const startBackgroundMusicLoop = async (): Promise<void> => {
	try {
		await Tone.start();
		const player = await initBackgroundMusicPlayer();
		Tone.Transport.start();
		player.start();
		isMusicStarted = true;
	} catch (error) {
		console.error("[audio] Failed to start background music:", error);
	}
};

export const pauseBackgroundMusicLoop = (): void => {
	if (!isMusicStarted || !backgroundMusicPlayer) {
		return;
	}

	Tone.Transport.pause();
	backgroundMusicPlayer.stop();
	isMusicStarted = false;
};

export const stopBackgroundMusicLoop = (): void => {
	if (!isMusicStarted || !backgroundMusicPlayer) {
		return;
	}

	Tone.Transport.stop();
	backgroundMusicPlayer.stop();
	isMusicStarted = false;
};

export const setBackgroundMusicVolume = (volume: number): void => {
	if (!backgroundMusicPlayer) {
		return;
	}

	backgroundMusicPlayer.volume.value = volume;
};

export const disposeMusicManager = (): void => {
	if (!backgroundMusicPlayer) {
		return;
	}

	backgroundMusicPlayer.dispose();
	backgroundMusicPlayer = null;
	isMusicStarted = false;
};
