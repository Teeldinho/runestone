import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_DEFAULTS, AUDIO_PATHS, AUDIO_SPRITES } from "../config";

import {
	disposeSoundManager,
	playSoundEffect,
	setSoundEffectsVolume,
	stopAllSoundEffects,
} from "./soundManager";

const {
	mockHowlConstructor,
	mockHowlPlay,
	mockHowlStop,
	mockHowlUnload,
	mockHowlVolume,
} = vi.hoisted(() => {
	const howlPlay = vi.fn();
	const howlStop = vi.fn();
	const howlVolume = vi.fn();
	const howlUnload = vi.fn();

	return {
		mockHowlPlay: howlPlay,
		mockHowlStop: howlStop,
		mockHowlVolume: howlVolume,
		mockHowlUnload: howlUnload,
		mockHowlConstructor: vi.fn(() => ({
			play: howlPlay,
			stop: howlStop,
			volume: howlVolume,
			unload: howlUnload,
		})),
	};
});

vi.mock("howler", () => ({
	Howl: mockHowlConstructor,
}));

describe("soundManager", () => {
	beforeEach(() => {
		disposeSoundManager();
		vi.clearAllMocks();
	});

	it("creates a singleton Howl and plays requested sprite", () => {
		playSoundEffect("DOOR_OPEN");

		expect(mockHowlConstructor).toHaveBeenCalledWith(
			expect.objectContaining({
				src: [AUDIO_PATHS.SFX],
				volume: AUDIO_DEFAULTS.SFX_VOLUME,
			}),
		);
		expect(mockHowlConstructor).toHaveBeenCalledWith(
			expect.objectContaining({
				sprite: expect.objectContaining({
					DOOR_OPEN: [AUDIO_SPRITES.DOOR_OPEN[0], AUDIO_SPRITES.DOOR_OPEN[1]],
				}),
			}),
		);
		expect(mockHowlPlay).toHaveBeenCalledWith("DOOR_OPEN");
	});

	it("updates sound effect volume", () => {
		setSoundEffectsVolume(0.33);

		expect(mockHowlVolume).toHaveBeenCalledWith(0.33);
	});

	it("stops all sound effects and disposes manager", () => {
		stopAllSoundEffects();
		disposeSoundManager();

		expect(mockHowlStop).toHaveBeenCalledTimes(1);
		expect(mockHowlUnload).toHaveBeenCalledTimes(1);
	});
});
