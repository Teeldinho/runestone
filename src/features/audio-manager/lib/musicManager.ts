import * as Tone from "tone";

import { AUDIO_DEFAULTS, AUDIO_PATHS } from "../config";

let backgroundMusicPlayer: Tone.Player | null = null;
let isMusicStarted = false;
let isMusicRequested = false;
let startBackgroundMusicPromise: Promise<void> | null = null;

const initBackgroundMusicPlayer = async (): Promise<Tone.Player> => {
	if (!backgroundMusicPlayer) {
		backgroundMusicPlayer = new Tone.Player();
		await backgroundMusicPlayer.load(AUDIO_PATHS.MUSIC);
		backgroundMusicPlayer.loop = AUDIO_DEFAULTS.MUSIC_LOOP;
		backgroundMusicPlayer.toDestination();
		backgroundMusicPlayer.volume.value = AUDIO_DEFAULTS.MUSIC_VOLUME;
	}

	return backgroundMusicPlayer;
};

export const startBackgroundMusicLoop = async (): Promise<void> => {
	isMusicRequested = true;

	if (isMusicStarted) {
		return;
	}

	if (!startBackgroundMusicPromise) {
		startBackgroundMusicPromise = (async () => {
			try {
				await Tone.start();
				const player = await initBackgroundMusicPlayer();

				if (!isMusicRequested || isMusicStarted) {
					return;
				}

				Tone.Transport.start();
				player.start();
				isMusicStarted = true;
			} catch (error) {
				console.error("[audio] Failed to start background music:", error);
			}
		})().finally(() => {
			startBackgroundMusicPromise = null;
		});
	}

	await startBackgroundMusicPromise;
};

export const pauseBackgroundMusicLoop = (): void => {
	isMusicRequested = false;

	if (!isMusicStarted || !backgroundMusicPlayer) {
		return;
	}

	Tone.Transport.pause();
	backgroundMusicPlayer.stop();
	isMusicStarted = false;
};

export const stopBackgroundMusicLoop = (): void => {
	isMusicRequested = false;

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
	isMusicRequested = false;
	startBackgroundMusicPromise = null;
};
