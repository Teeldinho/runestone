import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_PATHS } from "../config";

import {
	disposeMusicManager,
	pauseBackgroundMusicLoop,
	setBackgroundMusicVolume,
	startBackgroundMusicLoop,
	stopBackgroundMusicLoop,
} from "./musicManager";

const {
	mockPlayerDispose,
	mockPlayerInstance,
	mockPlayerStart,
	mockPlayerStop,
	mockTonePlayer,
	mockToneBuffer,
	mockToneStart,
	mockTransportPause,
	mockTransportStart,
	mockTransportStop,
} = vi.hoisted(() => {
	const playerStart = vi.fn();
	const playerStop = vi.fn();
	const playerDispose = vi.fn();
	const playerInstance = {
		start: playerStart,
		stop: playerStop,
		dispose: playerDispose,
		toDestination: vi.fn(),
		volume: {
			value: 0,
		},
	};
	const bufferInstance = {
		loaded: Promise.resolve(),
	};

	return {
		mockToneStart: vi.fn(),
		mockToneBuffer: vi.fn(() => bufferInstance),
		mockTransportStart: vi.fn(),
		mockTransportPause: vi.fn(),
		mockTransportStop: vi.fn(),
		mockPlayerStart: playerStart,
		mockPlayerStop: playerStop,
		mockPlayerDispose: playerDispose,
		mockPlayerInstance: playerInstance,
		mockTonePlayer: vi.fn(() => playerInstance),
	};
});

vi.mock("tone", () => ({
	start: mockToneStart,
	Player: mockTonePlayer,
	Buffer: mockToneBuffer,
	Transport: {
		start: mockTransportStart,
		pause: mockTransportPause,
		stop: mockTransportStop,
	},
}));

describe("musicManager", () => {
	beforeEach(() => {
		disposeMusicManager();
		vi.clearAllMocks();
		mockToneStart.mockResolvedValue(undefined);
	});

	it("starts looping background music through Tone transport", async () => {
		await startBackgroundMusicLoop();

		expect(mockToneStart).toHaveBeenCalledTimes(1);
		expect(mockToneBuffer).toHaveBeenCalledWith(AUDIO_PATHS.MUSIC);
		expect(mockTonePlayer).toHaveBeenCalled();
		expect(mockTransportStart).toHaveBeenCalledTimes(1);
		expect(mockPlayerStart).toHaveBeenCalledTimes(1);
	});

	it("pauses and stops background music transport", async () => {
		await startBackgroundMusicLoop();
		vi.clearAllMocks();

		pauseBackgroundMusicLoop();

		expect(mockTransportPause).toHaveBeenCalledTimes(1);
		expect(mockPlayerStop).toHaveBeenCalledTimes(1);

		await startBackgroundMusicLoop();
		vi.clearAllMocks();

		stopBackgroundMusicLoop();

		expect(mockTransportStop).toHaveBeenCalledTimes(1);
		expect(mockPlayerStop).toHaveBeenCalledTimes(1);
	});

	it("updates background music player volume", async () => {
		await startBackgroundMusicLoop();
		setBackgroundMusicVolume(0.45);

		expect(mockPlayerInstance.volume.value).toBe(0.45);
	});

	it("disposes background music player singleton", async () => {
		await startBackgroundMusicLoop();
		setBackgroundMusicVolume(0.45);
		disposeMusicManager();

		expect(mockPlayerDispose).toHaveBeenCalledTimes(1);
	});
});
