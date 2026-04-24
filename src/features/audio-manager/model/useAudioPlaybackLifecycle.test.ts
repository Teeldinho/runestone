// @vitest-environment happy-dom

import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_MACHINE_STATES } from "../config";

import { useAudioPlaybackLifecycle } from "./useAudioPlaybackLifecycle";

const {
	mockPauseBackgroundMusicLoop,
	mockStartBackgroundMusicLoop,
} = vi.hoisted(() => ({
	mockPauseBackgroundMusicLoop: vi.fn(),
	mockStartBackgroundMusicLoop: vi.fn(),
}));

vi.mock("../lib", async () => {
	const actual = await vi.importActual<typeof import("../lib")>("../lib");

	return {
		...actual,
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
		renderHook(() =>
			useAudioPlaybackLifecycle(AUDIO_MACHINE_STATES.PLAYING),
		);

		expect(mockStartBackgroundMusicLoop).not.toHaveBeenCalled();
		expect(mockPauseBackgroundMusicLoop).not.toHaveBeenCalled();
	});

	it("pauses while paused or muted and starts when returning to playing", async () => {
		const { rerender } = renderHook(
			({ audioState }: { audioState: string }) =>
				useAudioPlaybackLifecycle(audioState),
			{
				initialProps: {
					audioState: AUDIO_MACHINE_STATES.PLAYING,
				},
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
