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
	mockPlayerLoad,
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
	const playerLoad = vi.fn<() => Promise<void>>();
	const playerStart = vi.fn();
	const playerStop = vi.fn();
	const playerDispose = vi.fn();
	const playerInstance = {
		load: playerLoad,
		start: playerStart,
		stop: playerStop,
		dispose: playerDispose,
		toDestination: vi.fn(),
		volume: {
			value: 0,
		},
	};

	return {
		mockPlayerLoad: playerLoad,
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
	getContext: vi.fn(() => ({
		state: "suspended",
	})),
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
		mockPlayerLoad.mockResolvedValue(undefined);
	});

	it("starts looping background music through Tone transport", async () => {
		await startBackgroundMusicLoop();

		expect(mockToneStart).toHaveBeenCalledTimes(1);
		expect(mockTonePlayer).toHaveBeenCalledTimes(1);
		expect(mockPlayerLoad).toHaveBeenCalledWith(AUDIO_PATHS.MUSIC);
		expect(mockTransportStart).toHaveBeenCalledTimes(1);
		expect(mockPlayerStart).toHaveBeenCalledTimes(1);
	});

	it("runs start as a single in-flight operation", async () => {
		await Promise.all([startBackgroundMusicLoop(), startBackgroundMusicLoop()]);

		expect(mockToneStart).toHaveBeenCalledTimes(1);
		expect(mockPlayerLoad).toHaveBeenCalledTimes(1);
		expect(mockTransportStart).toHaveBeenCalledTimes(1);
		expect(mockPlayerStart).toHaveBeenCalledTimes(1);
	});

	it("does not call stop methods before music starts", () => {
		pauseBackgroundMusicLoop();
		stopBackgroundMusicLoop();

		expect(mockTransportPause).not.toHaveBeenCalled();
		expect(mockTransportStop).not.toHaveBeenCalled();
		expect(mockPlayerStop).not.toHaveBeenCalled();
	});

	it("pauses and stops background music transport after start", async () => {
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

	it("does not start playback when pause is requested during pending load", async () => {
		const pendingLoad = {
			resolve: () => undefined,
		};
		const loadPromise = new Promise<void>((resolve) => {
			pendingLoad.resolve = () => {
				resolve();
			};
		});
		mockPlayerLoad.mockReturnValueOnce(loadPromise);

		const startPromise = startBackgroundMusicLoop();
		pauseBackgroundMusicLoop();

		pendingLoad.resolve();
		await startPromise;

		expect(mockTransportStart).not.toHaveBeenCalled();
		expect(mockPlayerStart).not.toHaveBeenCalled();
	});

	it("updates background music player volume", async () => {
		await startBackgroundMusicLoop();
		setBackgroundMusicVolume(0.45);

		expect(mockPlayerInstance.volume.value).toBe(0.45);
	});

	it("disposes background music player singleton", async () => {
		await startBackgroundMusicLoop();
		disposeMusicManager();

		expect(mockPlayerDispose).toHaveBeenCalledTimes(1);
	});
});
