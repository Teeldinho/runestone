// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_MACHINE_STATES } from "../config";

import { useAudio } from "./useAudio";

const {
	mockPauseBackgroundMusicLoop,
	mockPlaySoundEffect,
	mockStartBackgroundMusicLoop,
	mockStopAllSoundEffects,
	mockStopBackgroundMusicLoop,
} = vi.hoisted(() => ({
	mockStartBackgroundMusicLoop: vi.fn(),
	mockPauseBackgroundMusicLoop: vi.fn(),
	mockStopBackgroundMusicLoop: vi.fn(),
	mockPlaySoundEffect: vi.fn(),
	mockStopAllSoundEffects: vi.fn(),
}));

vi.mock("../lib", () => ({
	startBackgroundMusicLoop: mockStartBackgroundMusicLoop,
	pauseBackgroundMusicLoop: mockPauseBackgroundMusicLoop,
	stopBackgroundMusicLoop: mockStopBackgroundMusicLoop,
	playSoundEffect: mockPlaySoundEffect,
	stopAllSoundEffects: mockStopAllSoundEffects,
}));

describe("useAudio", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockStartBackgroundMusicLoop.mockResolvedValue(undefined);
	});

	it("starts playing and calls startBackgroundMusicLoop on mount", async () => {
		const { result } = renderHook(() => useAudio());

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.PLAYING);

		await waitFor(() => {
			expect(mockStartBackgroundMusicLoop).toHaveBeenCalledTimes(1);
		});
	});

	it("suppresses sound effect playback while muted", () => {
		const { result } = renderHook(() => useAudio());

		act(() => {
			result.current.handleAudioMuteToggle();
			result.current.handleSoundEffectPlay("DOOR_OPEN");
		});

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.MUTED);
		expect(mockPlaySoundEffect).not.toHaveBeenCalled();
		expect(mockStopAllSoundEffects).toHaveBeenCalledTimes(1);
	});

	it("unmutes back to previous audible state", async () => {
		const { result } = renderHook(() => useAudio());

		act(() => {
			result.current.handleAudioPlayRequest();
			result.current.handleAudioMuteToggle();
			result.current.handleAudioMuteToggle();
		});

		await waitFor(() => {
			expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.PLAYING);
		});
	});
});
