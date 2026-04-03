import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_DEFAULTS, AUDIO_PATHS } from "../config";

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

	return {
		mockToneStart: vi.fn(),
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
		expect(mockTonePlayer).toHaveBeenCalledWith({
			autostart: false,
			loop: AUDIO_DEFAULTS.MUSIC_LOOP,
			url: AUDIO_PATHS.MUSIC,
		});
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

	it("updates background music player volume", () => {
		setBackgroundMusicVolume(0.45);

		expect(mockPlayerInstance.volume.value).toBe(0.45);
	});

	it("disposes background music player singleton", () => {
		setBackgroundMusicVolume(0.45);
		disposeMusicManager();

		expect(mockPlayerDispose).toHaveBeenCalledTimes(1);
	});

	it("skips pause when music was never started", () => {
		pauseBackgroundMusicLoop();

		expect(mockTransportPause).not.toHaveBeenCalled();
		expect(mockPlayerStop).not.toHaveBeenCalled();
	});

	it("skips stop when music was never started", () => {
		stopBackgroundMusicLoop();

		expect(mockTransportStop).not.toHaveBeenCalled();
		expect(mockPlayerStop).not.toHaveBeenCalled();
	});

	it("pauses correctly after music has started", async () => {
		await startBackgroundMusicLoop();
		vi.clearAllMocks();

		pauseBackgroundMusicLoop();

		expect(mockTransportPause).toHaveBeenCalledTimes(1);
		expect(mockPlayerStop).toHaveBeenCalledTimes(1);
	});

	it("stops correctly after music has started", async () => {
		await startBackgroundMusicLoop();
		vi.clearAllMocks();

		stopBackgroundMusicLoop();

		expect(mockTransportStop).toHaveBeenCalledTimes(1);
		expect(mockPlayerStop).toHaveBeenCalledTimes(1);
	});

	it("resets started flag on dispose so pause/stop are skipped after", async () => {
		await startBackgroundMusicLoop();
		disposeMusicManager();
		vi.clearAllMocks();

		pauseBackgroundMusicLoop();
		stopBackgroundMusicLoop();

		expect(mockTransportPause).not.toHaveBeenCalled();
		expect(mockTransportStop).not.toHaveBeenCalled();
		expect(mockPlayerStop).not.toHaveBeenCalled();
	});
});
