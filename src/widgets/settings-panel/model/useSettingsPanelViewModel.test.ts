// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSettingsPanelViewModel } from "./useSettingsPanelViewModel";

const {
	mockHandleMasterVolumeSliderChange,
	mockHandleMusicVolumeSliderChange,
	mockHandlePostprocessingToggle,
	mockHandleHapticsToggle,
	mockHandleSettingsReset,
	mockUseSettingsForm,
} = vi.hoisted(() => ({
	mockHandleMasterVolumeSliderChange: vi.fn(),
	mockHandleMusicVolumeSliderChange: vi.fn(),
	mockHandlePostprocessingToggle: vi.fn(),
	mockHandleHapticsToggle: vi.fn(),
	mockHandleSettingsReset: vi.fn(),
	mockUseSettingsForm: vi.fn(() => ({
		hapticsEnabled: true,
		handleHapticsToggle: mockHandleHapticsToggle,
		handleMasterVolumeSliderChange: mockHandleMasterVolumeSliderChange,
		handleMusicVolumeSliderChange: mockHandleMusicVolumeSliderChange,
		handlePostprocessingToggle: mockHandlePostprocessingToggle,
		handleSettingsReset: mockHandleSettingsReset,
		masterVolume: 0.8,
		musicVolume: 0.55,
		postprocessingEnabled: false,
	})),
}));

vi.mock("@/features/settings", async () => {
	const actual = await vi.importActual<typeof import("@/features/settings")>(
		"@/features/settings",
	);

	return {
		...actual,
		useSettingsForm: mockUseSettingsForm,
	};
});

describe("useSettingsPanelViewModel", () => {
	it("groups settings controls and derives display labels", () => {
		const { result } = renderHook(() => useSettingsPanelViewModel());

		expect(result.current.audio.masterVolume).toBe(0.8);
		expect(result.current.audio.masterVolumeLabel).toBe("80%");
		expect(result.current.audio.musicVolume).toBe(0.55);
		expect(result.current.audio.musicVolumeLabel).toBe("55%");
		expect(result.current.audio.handleMasterVolumeSliderChange).toBe(
			mockHandleMasterVolumeSliderChange,
		);
		expect(result.current.audio.handleMusicVolumeSliderChange).toBe(
			mockHandleMusicVolumeSliderChange,
		);
		expect(result.current.graphics.postprocessingEnabled).toBe(false);
		expect(result.current.graphics.handlePostprocessingToggle).toBe(
			mockHandlePostprocessingToggle,
		);
		expect(result.current.haptics.hapticsEnabled).toBe(true);
		expect(result.current.haptics.handleHapticsToggle).toBe(
			mockHandleHapticsToggle,
		);
		expect(result.current.actions.handleSettingsReset).toBe(
			mockHandleSettingsReset,
		);
	});
});
