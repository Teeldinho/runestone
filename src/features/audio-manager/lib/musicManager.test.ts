import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_DEFAULTS, AUDIO_PATHS } from "../config";

import {
	disposeMusicManager,
	pauseBackgroundMusicLoop,
	setBackgroundMusicVolume,
	startBackgroundMusicLoop,
	stopBackgroundMusicLoop,
} from "./musicManager";

const mockToneStart = vi.fn();
const mockTransportStart = vi.fn();
const mockTransportPause = vi.fn();
const mockTransportStop = vi.fn();

const mockPlayerStart = vi.fn();
const mockPlayerStop = vi.fn();
const mockPlayerDispose = vi.fn();

const mockPlayerInstance = {
	start: mockPlayerStart,
	stop: mockPlayerStop,
	dispose: mockPlayerDispose,
	toDestination: vi.fn(),
	volume: {
		value: 0,
	},
};

const mockTonePlayer = vi.fn(() => mockPlayerInstance);

vi.mock("tone", () => ({
	start: mockToneStart,
	Player: mockTonePlayer,
	Transport: {
		start: mockTransportStart,
		pause: mockTransportPause,
		stop: mockTransportStop,
	},
}));

describe("musicManager", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		disposeMusicManager();
		mockToneStart.mockResolvedValue(undefined);
	});

	it("starts looping background music through Tone transport", async () => {
		await startBackgroundMusicLoop();

		expect(mockToneStart).toHaveBeenCalledTimes(1);
		expect(mockTonePlayer).toHaveBeenCalledWith({
			autostart: false,
			loop: AUDIO_DEFAULTS.MUSIC_LOOP,
			url: AUDIO_PATHS.MUSIC,
		});
		expect(mockTransportStart).toHaveBeenCalledTimes(1);
		expect(mockPlayerStart).toHaveBeenCalledTimes(1);
	});

	it("pauses and stops background music transport", () => {
		pauseBackgroundMusicLoop();
		stopBackgroundMusicLoop();

		expect(mockTransportPause).toHaveBeenCalledTimes(1);
		expect(mockTransportStop).toHaveBeenCalledTimes(1);
		expect(mockPlayerStop).toHaveBeenCalledTimes(2);
	});

	it("updates background music player volume", () => {
		setBackgroundMusicVolume(0.45);

		expect(mockPlayerInstance.volume.value).toBe(0.45);
	});
});
