// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
	AUDIO_MACHINE_STATES,
	useAudioController,
} from "@/features/audio-manager";

import { useGamePageAudio } from "./useGamePageAudio";

vi.mock("@/features/audio-manager", () => ({
	AUDIO_MACHINE_STATES: {
		PLAYING: "playing",
	},
	audioMachine: {},
	useAudioController: vi.fn(),
}));

describe("useGamePageAudio", () => {
	it("returns audio state from useAudioController", () => {
		const handleAudioMuteToggle = vi.fn();
		const handleAudioPlayRequest = vi.fn();

		vi.mocked(useAudioController).mockReturnValue({
			audioState: AUDIO_MACHINE_STATES.PLAYING,
			handleAudioPlayRequest,
			handleAudioMuteToggle,
			handleAudioPauseRequest: vi.fn(),
			handleAudioStopRequest: vi.fn(),
			isAudioMuted: false,
			isAudioPlaying: true,
		});

		const { result } = renderHook(() => useGamePageAudio());

		expect(result.current.isAudioMuted).toBe(false);
		expect(result.current.handleAudioMuteToggle).toBe(handleAudioMuteToggle);
	});

	it("returns muted state when audio is muted", () => {
		const handleAudioMuteToggle = vi.fn();
		const handleAudioPlayRequest = vi.fn();

		vi.mocked(useAudioController).mockReturnValue({
			audioState: AUDIO_MACHINE_STATES.PLAYING,
			handleAudioPlayRequest,
			handleAudioMuteToggle,
			handleAudioPauseRequest: vi.fn(),
			handleAudioStopRequest: vi.fn(),
			isAudioMuted: true,
			isAudioPlaying: true,
		});

		const { result } = renderHook(() => useGamePageAudio());

		expect(result.current.isAudioMuted).toBe(true);
	});

	it("triggers handleAudioPlayRequest on mount", () => {
		const handleAudioMuteToggle = vi.fn();
		const handleAudioPlayRequest = vi.fn();

		vi.mocked(useAudioController).mockReturnValue({
			audioState: AUDIO_MACHINE_STATES.PLAYING,
			handleAudioPlayRequest,
			handleAudioMuteToggle,
			handleAudioPauseRequest: vi.fn(),
			handleAudioStopRequest: vi.fn(),
			isAudioMuted: false,
			isAudioPlaying: true,
		});

		renderHook(() => useGamePageAudio());

		expect(handleAudioPlayRequest).toHaveBeenCalledTimes(1);
	});
});
