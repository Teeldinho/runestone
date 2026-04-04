// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_MACHINE_STATES } from "../config";

import { useAudio } from "./useAudio";

const { mockPauseBackgroundMusicLoop, mockStopBackgroundMusicLoop } =
	vi.hoisted(() => ({
		mockPauseBackgroundMusicLoop: vi.fn(),
		mockStopBackgroundMusicLoop: vi.fn(),
	}));

vi.mock("../lib", () => ({
	pauseBackgroundMusicLoop: mockPauseBackgroundMusicLoop,
	stopBackgroundMusicLoop: mockStopBackgroundMusicLoop,
}));

describe("useAudio", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("starts in PLAYING state", () => {
		const { result } = renderHook(() => useAudio());

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.PLAYING);
	});

	it("pauses music when muted", () => {
		const { result } = renderHook(() => useAudio());

		act(() => {
			result.current.handleAudioMuteToggle();
		});

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.MUTED);
		expect(mockPauseBackgroundMusicLoop).toHaveBeenCalled();
	});

	it("unmutes back to previous audible state", () => {
		const { result } = renderHook(() => useAudio());

		act(() => {
			result.current.handleAudioPlayRequest();
			result.current.handleAudioMuteToggle();
			result.current.handleAudioMuteToggle();
		});

		expect(result.current.audioState).toBe(AUDIO_MACHINE_STATES.PLAYING);
	});
});
