// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_MACHINE_STATES } from "../config";

import type { AudioMachineState } from "./types";
import { useAudioPlaybackLifecycle } from "./useAudioPlaybackLifecycle";

type UseAudioPlaybackLifecycleTestProps = {
	audioState: AudioMachineState;
};

const { mockPauseBackgroundMusicLoop, mockStartBackgroundMusicLoop } =
	vi.hoisted(() => ({
		mockPauseBackgroundMusicLoop: vi.fn(),
		mockStartBackgroundMusicLoop: vi.fn(),
	}));

vi.mock("../lib", async () => {
	return {
		pauseBackgroundMusicLoop: mockPauseBackgroundMusicLoop,
		startBackgroundMusicLoop: mockStartBackgroundMusicLoop,
	};
});

describe("useAudioPlaybackLifecycle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockStartBackgroundMusicLoop.mockResolvedValue(undefined);
	});

	it("does not auto-start on initial playing mount", () => {
		renderHook(() => useAudioPlaybackLifecycle(AUDIO_MACHINE_STATES.PLAYING));

		expect(mockStartBackgroundMusicLoop).not.toHaveBeenCalled();
		expect(mockPauseBackgroundMusicLoop).not.toHaveBeenCalled();
	});

	it("pauses while paused or muted and starts when returning to playing", async () => {
		const initialProps: UseAudioPlaybackLifecycleTestProps = {
			audioState: AUDIO_MACHINE_STATES.PLAYING,
		};

		const { rerender } = renderHook(
			({ audioState }: UseAudioPlaybackLifecycleTestProps) =>
				useAudioPlaybackLifecycle(audioState),
			{
				initialProps,
			},
		);

		act(() => {
			rerender({
				audioState: AUDIO_MACHINE_STATES.PAUSED,
			});
		});

		expect(mockPauseBackgroundMusicLoop).toHaveBeenCalledTimes(1);

		act(() => {
			rerender({
				audioState: AUDIO_MACHINE_STATES.PLAYING,
			});
		});

		await waitFor(() => {
			expect(mockStartBackgroundMusicLoop).toHaveBeenCalledTimes(1);
		});

		act(() => {
			rerender({
				audioState: AUDIO_MACHINE_STATES.MUTED,
			});
		});

		expect(mockPauseBackgroundMusicLoop).toHaveBeenCalledTimes(2);
	});
});
