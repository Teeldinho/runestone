// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_MACHINE_STATES } from "../config";

import { useAudio } from "./useAudio";

const {
	mockPauseBackgroundMusicLoop,
	mockStartBackgroundMusicLoop,
	mockStopBackgroundMusicLoop,
} = vi.hoisted(() => ({
	mockStartBackgroundMusicLoop: vi.fn(),
	mockPauseBackgroundMusicLoop: vi.fn(),
	mockStopBackgroundMusicLoop: vi.fn(),
}));

vi.mock("../lib", () => ({
	startBackgroundMusicLoop: mockStartBackgroundMusicLoop,
	pauseBackgroundMusicLoop: mockPauseBackgroundMusicLoop,
	stopBackgroundMusicLoop: mockStopBackgroundMusicLoop,
}));

describe("useAudio", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockStartBackgroundMusicLoop.mockResolvedValue(undefined);
	});

	it("initializes in playing state without auto-starting on mount", () => {
		const { result } = renderHook(() => useAudio());

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.PLAYING);
		expect(mockStartBackgroundMusicLoop).not.toHaveBeenCalled();
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
