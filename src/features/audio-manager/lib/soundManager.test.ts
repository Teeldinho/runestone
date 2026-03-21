import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUDIO_DEFAULTS, AUDIO_PATHS, AUDIO_SPRITES } from "../config";

import {
	disposeSoundManager,
	playSoundEffect,
	setSoundEffectsVolume,
	stopAllSoundEffects,
} from "./soundManager";

const mockHowlPlay = vi.fn();
const mockHowlStop = vi.fn();
const mockHowlVolume = vi.fn();
const mockHowlUnload = vi.fn();
const mockHowlConstructor = vi.fn(() => ({
	play: mockHowlPlay,
	stop: mockHowlStop,
	volume: mockHowlVolume,
	unload: mockHowlUnload,
}));

vi.mock("howler", () => ({
	Howl: mockHowlConstructor,
}));

describe("soundManager", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		disposeSoundManager();
	});

	it("creates a singleton Howl and plays requested sprite", () => {
		playSoundEffect("DOOR_OPEN");

		expect(mockHowlConstructor).toHaveBeenCalledWith({
			src: [AUDIO_PATHS.SFX],
			sprite: AUDIO_SPRITES,
			volume: AUDIO_DEFAULTS.SFX_VOLUME,
		});
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
