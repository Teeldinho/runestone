// @vitest-environment happy-dom

import { render, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AudioProvider } from "./AudioProvider";
import { AUDIO_PROVIDER_UNLOCK_EVENT_LIST } from "./audioProviderEvents";

const {
	mockStartBackgroundMusicLoop,
	mockToneStart,
	mockUseAudio,
	mockAudioController,
} = vi.hoisted(() => {
	const audioController = {
		audioState: "paused",
		isAudioMuted: false,
		isAudioPlaying: false,
		handleAudioMuteToggle: vi.fn(),
		handleAudioPauseRequest: vi.fn(),
		handleAudioPlayRequest: vi.fn(),
		handleAudioStopRequest: vi.fn(),
	};

	return {
		mockAudioController: audioController,
		mockUseAudio: vi.fn(() => audioController),
		mockStartBackgroundMusicLoop: vi.fn(() => Promise.resolve()),
		mockToneStart: vi.fn(() => Promise.resolve()),
	};
});

vi.mock("tone", () => ({
	start: mockToneStart,
}));

vi.mock("@/features/audio-manager", () => ({
	AudioContext: {
		Provider: ({ children }: { children: ReactNode }) => children,
	},
	startBackgroundMusicLoop: mockStartBackgroundMusicLoop,
	useAudio: mockUseAudio,
}));

describe("AudioProvider", () => {
	afterEach(() => {
		vi.clearAllMocks();
		mockAudioController.isAudioPlaying = false;
		mockAudioController.audioState = "paused";
	});

	it("unlocks Tone.js on first user interaction without starting music while paused", async () => {
		render(
			<AudioProvider>
				<div>child</div>
			</AudioProvider>,
		);

		window.dispatchEvent(new Event(AUDIO_PROVIDER_UNLOCK_EVENT_LIST[0]));

		await waitFor(() => {
			expect(mockToneStart).toHaveBeenCalledTimes(1);
		});

		expect(mockStartBackgroundMusicLoop).not.toHaveBeenCalled();
	});

	it("starts music on first interaction only when the audio controller is already playing", async () => {
		mockAudioController.isAudioPlaying = true;
		mockAudioController.audioState = "playing";

		render(
			<AudioProvider>
				<div>child</div>
			</AudioProvider>,
		);

		window.dispatchEvent(new Event(AUDIO_PROVIDER_UNLOCK_EVENT_LIST[0]));

		await waitFor(() => {
			expect(mockToneStart).toHaveBeenCalledTimes(1);
			expect(mockStartBackgroundMusicLoop).toHaveBeenCalledTimes(1);
		});
	});

	it("removes unlock listeners after the first interaction", async () => {
		render(
			<AudioProvider>
				<div>child</div>
			</AudioProvider>,
		);

		window.dispatchEvent(new Event(AUDIO_PROVIDER_UNLOCK_EVENT_LIST[0]));

		await waitFor(() => {
			expect(mockToneStart).toHaveBeenCalledTimes(1);
		});

		window.dispatchEvent(new Event(AUDIO_PROVIDER_UNLOCK_EVENT_LIST[1]));

		expect(mockToneStart).toHaveBeenCalledTimes(1);
	});
});
