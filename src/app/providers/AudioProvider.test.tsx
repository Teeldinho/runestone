// @vitest-environment happy-dom

import { render, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AudioProvider } from "./AudioProvider";
import { AUDIO_PROVIDER_UNLOCK_EVENT_LIST } from "./audioProviderEvents";

const { mockStartBackgroundMusicLoop, mockUseAudio } = vi.hoisted(() => {
	const audioController = {
		audioState: "playing",
		isAudioMuted: false,
		isAudioPlaying: true,
		handleAudioMuteToggle: vi.fn(),
		handleAudioPauseRequest: vi.fn(),
		handleAudioPlayRequest: vi.fn(),
		handleAudioStopRequest: vi.fn(),
	};

	return {
		mockUseAudio: vi.fn(() => audioController),
		mockStartBackgroundMusicLoop: vi.fn(() => Promise.resolve()),
	};
});

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
	});

	it("starts background music loop on first user interaction", async () => {
		render(
			<AudioProvider>
				<div>child</div>
			</AudioProvider>,
		);

		window.dispatchEvent(new Event(AUDIO_PROVIDER_UNLOCK_EVENT_LIST[0]));

		await waitFor(() => {
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
			expect(mockStartBackgroundMusicLoop).toHaveBeenCalledTimes(1);
		});

		window.dispatchEvent(new Event(AUDIO_PROVIDER_UNLOCK_EVENT_LIST[1]));

		expect(mockStartBackgroundMusicLoop).toHaveBeenCalledTimes(1);
	});
});
