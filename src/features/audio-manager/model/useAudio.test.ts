// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_MACHINE_STATES, AUDIO_SETTINGS_DEFAULTS } from "../config";

import { useAudio } from "./useAudio";

type UseAudioTestSettings = {
	masterVolume: number;
	musicVolume: number;
};

const {
	mockPauseBackgroundMusicLoop,
	mockStartBackgroundMusicLoop,
	mockStopBackgroundMusicLoop,
	mockSetBackgroundMusicVolume,
	mockToneDestination,
	mockToneGetDestination,
	mockGainToDb,
} = vi.hoisted(() => {
	const gainToDb = (value: number): number =>
		value === 0 ? Number.NEGATIVE_INFINITY : 20 * Math.log10(value);

	const toneDestination = {
		volume: {
			value: 0,
		},
	};

	return {
		mockStartBackgroundMusicLoop: vi.fn(),
		mockPauseBackgroundMusicLoop: vi.fn(),
		mockStopBackgroundMusicLoop: vi.fn(),
		mockSetBackgroundMusicVolume: vi.fn(),
		mockToneDestination: toneDestination,
		mockToneGetDestination: vi.fn(() => toneDestination),
		mockGainToDb: gainToDb,
	};
});

vi.mock("tone", () => ({
	gainToDb: mockGainToDb,
	getDestination: mockToneGetDestination,
}));

vi.mock("../lib", async () => {
	const actual = await vi.importActual<typeof import("../lib")>("../lib");

	return {
		...actual,
		startBackgroundMusicLoop: mockStartBackgroundMusicLoop,
		pauseBackgroundMusicLoop: mockPauseBackgroundMusicLoop,
		stopBackgroundMusicLoop: mockStopBackgroundMusicLoop,
		setBackgroundMusicVolume: mockSetBackgroundMusicVolume,
	};
});

describe("useAudio", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockStartBackgroundMusicLoop.mockResolvedValue(undefined);
		mockToneDestination.volume.value = 0;
	});

	it("initializes in playing state without auto-starting on mount", () => {
		const { result } = renderHook(() => useAudio());

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.PLAYING);
		expect(mockStartBackgroundMusicLoop).not.toHaveBeenCalled();
	});

	it("applies settings-driven audio volume on mount and update", async () => {
		let audioSettings: UseAudioTestSettings = {
			masterVolume: AUDIO_SETTINGS_DEFAULTS.masterVolume,
			musicVolume: AUDIO_SETTINGS_DEFAULTS.musicVolume,
		};
		const { rerender } = renderHook(() => useAudio(audioSettings));

		await waitFor(() => {
			expect(mockSetBackgroundMusicVolume).toHaveBeenCalledWith(0.55);
			expect(mockToneDestination.volume.value).toBeCloseTo(mockGainToDb(0.8));
		});

		act(() => {
			audioSettings = { masterVolume: 0.5, musicVolume: 0.25 };
			rerender();
		});

		await waitFor(() => {
			expect(mockSetBackgroundMusicVolume).toHaveBeenLastCalledWith(0.25);
			expect(mockToneDestination.volume.value).toBeCloseTo(mockGainToDb(0.5));
		});
	});

	it("starts background music when transitioning back to playing", async () => {
		const { result } = renderHook(() => useAudio());

		act(() => {
			result.current.handleAudioPauseRequest();
		});

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.PAUSED);

		act(() => {
			result.current.handleAudioPlayRequest();
		});

		await waitFor(() => {
			expect(mockStartBackgroundMusicLoop).toHaveBeenCalledTimes(1);
		});
	});

	it("pauses background music when muted", () => {
		const { result } = renderHook(() => useAudio());

		act(() => {
			result.current.handleAudioMuteToggle();
		});

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.MUTED);
		expect(mockPauseBackgroundMusicLoop).toHaveBeenCalled();
	});

	it("unmutes back to previous audible state", async () => {
		const { result } = renderHook(() => useAudio());

		act(() => {
			result.current.handleAudioMuteToggle();
		});

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.MUTED);

		act(() => {
			result.current.handleAudioMuteToggle();
		});

		await waitFor(() => {
			expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.PLAYING);
			expect(mockStartBackgroundMusicLoop).toHaveBeenCalledTimes(1);
		});
	});
});
