// @vitest-environment happy-dom

import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_SETTINGS_DEFAULTS } from "../config";

import { useAudioVolumeSync } from "./useAudioVolumeSync";

type UseAudioVolumeSyncTestProps = {
	masterVolume: number;
	musicVolume: number;
};

const {
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

vi.mock("../lib", () => ({
	setBackgroundMusicVolume: mockSetBackgroundMusicVolume,
}));

describe("useAudioVolumeSync", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockToneDestination.volume.value = 0;
	});

	it("applies the initial volume settings", async () => {
		renderHook(() =>
			useAudioVolumeSync({
				masterVolume: AUDIO_SETTINGS_DEFAULTS.masterVolume,
				musicVolume: AUDIO_SETTINGS_DEFAULTS.musicVolume,
			}),
		);

		await waitFor(() => {
			expect(mockSetBackgroundMusicVolume).toHaveBeenCalledWith(0.55);
			expect(mockToneDestination.volume.value).toBeCloseTo(mockGainToDb(0.8));
		});
	});

	it("updates the destination and background music volumes when settings change", async () => {
		const initialProps: UseAudioVolumeSyncTestProps = {
			masterVolume: AUDIO_SETTINGS_DEFAULTS.masterVolume,
			musicVolume: AUDIO_SETTINGS_DEFAULTS.musicVolume,
		};

		const { rerender } = renderHook(
			({ masterVolume, musicVolume }: UseAudioVolumeSyncTestProps) =>
				useAudioVolumeSync({
					masterVolume,
					musicVolume,
				}),
			{
				initialProps,
			},
		);

		rerender({
			masterVolume: 0.5,
			musicVolume: 0.25,
		});

		await waitFor(() => {
			expect(mockSetBackgroundMusicVolume).toHaveBeenLastCalledWith(0.25);
			expect(mockToneDestination.volume.value).toBeCloseTo(mockGainToDb(0.5));
		});
	});
});
