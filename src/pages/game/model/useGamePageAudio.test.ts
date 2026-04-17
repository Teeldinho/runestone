// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAudioController } from "@/features/audio-manager";

import { useGamePageAudio } from "./useGamePageAudio";

const mockHandleAudioMuteToggle = vi.fn();
const mockHandleAudioPlayRequest = vi.fn();

vi.mock("@/features/audio-manager", () => ({
	useAudioController: vi.fn(() => ({
		audioState: "playing",
		handleAudioPlayRequest: mockHandleAudioPlayRequest,
		handleAudioMuteToggle: mockHandleAudioMuteToggle,
		isAudioMuted: true,
	})),
}));

describe("useGamePageAudio", () => {
	it("requests audio playback on mount and exposes controller values", () => {
		const { result } = renderHook(() => useGamePageAudio());

		expect(vi.mocked(useAudioController)).toHaveBeenCalledTimes(1);
		expect(mockHandleAudioPlayRequest).toHaveBeenCalledTimes(1);
		expect(result.current.audioState).toBe("playing");
		expect(result.current.isAudioMuted).toBe(true);
		expect(result.current.handleAudioMuteToggle).toBe(
			mockHandleAudioMuteToggle,
		);
	});
});
