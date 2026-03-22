// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSettingsForm } from "./useSettingsForm";

const { mockWriteSettings, mockResetSettings } = vi.hoisted(() => ({
	mockWriteSettings: vi.fn(),
	mockResetSettings: vi.fn(),
}));

vi.mock("@/features/settings", () => ({
	readSettings: () => ({
		masterVolume: 0.8,
		musicVolume: 0.55,
		sfxVolume: 0.9,
		hapticsEnabled: true,
	}),
	writeSettings: mockWriteSettings,
	resetSettings: mockResetSettings,
	SETTINGS_DEFAULTS: {
		masterVolume: 0.8,
		musicVolume: 0.55,
		sfxVolume: 0.9,
		hapticsEnabled: true,
	},
	SETTINGS_COPY: {
		PAGE_TITLE: "Settings",
		PAGE_DESCRIPTION: "Adjust audio levels and haptic feedback.",
		AUDIO_SECTION: "Audio",
		HAPTICS_SECTION: "Haptics",
		MASTER_VOLUME_LABEL: "Master Volume",
		MUSIC_VOLUME_LABEL: "Music Volume",
		SFX_VOLUME_LABEL: "SFX Volume",
		HAPTICS_TOGGLE_LABEL: "Haptic Feedback",
		RESET_BUTTON: "Reset to Defaults",
	},
	SETTINGS_VOLUME_RANGE: {
		MIN: 0,
		MAX: 1,
		STEP: 0.05,
	},
}));

describe("useSettingsForm", () => {
	it("returns default settings on initial load", () => {
		const { result } = renderHook(() => useSettingsForm());

		expect(result.current.masterVolume).toBe(0.8);
		expect(result.current.musicVolume).toBe(0.55);
		expect(result.current.sfxVolume).toBe(0.9);
		expect(result.current.hapticsEnabled).toBe(true);
	});

	it("updates master volume and persists", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleMasterVolumeChange(0.5);
		});

		expect(result.current.masterVolume).toBe(0.5);
		expect(mockWriteSettings).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ masterVolume: 0.5 }),
		);
	});

	it("toggles haptics and persists", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleHapticsToggle(false);
		});

		expect(result.current.hapticsEnabled).toBe(false);
		expect(mockWriteSettings).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ hapticsEnabled: false }),
		);
	});

	it("resets to defaults", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleSettingsReset();
		});

		expect(mockResetSettings).toHaveBeenCalled();
		expect(result.current.masterVolume).toBe(0.8);
		expect(result.current.hapticsEnabled).toBe(true);
	});
});
