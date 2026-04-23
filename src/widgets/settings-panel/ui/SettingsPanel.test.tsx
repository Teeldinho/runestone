// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SETTINGS_COPY } from "@/features/settings";

const {
	mockHandleMasterVolumeSliderChange,
	mockHandleMusicVolumeSliderChange,
	mockHandlePostprocessingToggle,
	mockHandleHapticsToggle,
	mockHandleSettingsReset,
	mockUseSettingsPanelViewModel,
} = vi.hoisted(() => ({
	mockHandleMasterVolumeSliderChange: vi.fn(),
	mockHandleMusicVolumeSliderChange: vi.fn(),
	mockHandlePostprocessingToggle: vi.fn(),
	mockHandleHapticsToggle: vi.fn(),
	mockHandleSettingsReset: vi.fn(),
	mockUseSettingsPanelViewModel: vi.fn(() => ({
		actions: {
			handleSettingsReset: mockHandleSettingsReset,
		},
		audio: {
			handleMasterVolumeSliderChange: mockHandleMasterVolumeSliderChange,
			handleMusicVolumeSliderChange: mockHandleMusicVolumeSliderChange,
			masterVolume: 0.8,
			masterVolumeLabel: "80%",
			musicVolume: 0.55,
			musicVolumeLabel: "55%",
		},
		graphics: {
			handlePostprocessingToggle: mockHandlePostprocessingToggle,
			postprocessingEnabled: true,
		},
		haptics: {
			handleHapticsToggle: mockHandleHapticsToggle,
			hapticsEnabled: false,
		},
	})),
}));

vi.mock("../model", () => ({
	useSettingsPanelViewModel: mockUseSettingsPanelViewModel,
}));

import { SettingsPanel } from "./SettingsPanel";

describe("SettingsPanel", () => {
	it("renders the panel sections and preserves description wiring", () => {
		const { container } = render(<SettingsPanel />);

		expect(screen.getByText(SETTINGS_COPY.PAGE_TITLE)).toBeTruthy();
		expect(screen.getByText(SETTINGS_COPY.PAGE_DESCRIPTION)).toBeTruthy();
		expect(screen.getByText(SETTINGS_COPY.AUDIO_SECTION)).toBeTruthy();
		expect(screen.getByText(SETTINGS_COPY.GRAPHICS_SECTION)).toBeTruthy();
		expect(screen.getByText(SETTINGS_COPY.HAPTICS_SECTION)).toBeTruthy();
		expect(
			screen.getByRole("button", { name: SETTINGS_COPY.RESET_BUTTON }),
		).toBeTruthy();

		const masterVolumeSlider = container.querySelector(
			"#master-volume",
		) as HTMLElement | null;
		expect(masterVolumeSlider).not.toBeNull();
		const masterVolumeDescription = screen.getByText("80%");
		expect(masterVolumeSlider?.getAttribute("aria-describedby")).toBe(
			masterVolumeDescription.id,
		);

		const musicVolumeSlider = container.querySelector(
			"#music-volume",
		) as HTMLElement | null;
		expect(musicVolumeSlider).not.toBeNull();
		const musicVolumeDescription = screen.getByText("55%");
		expect(musicVolumeSlider?.getAttribute("aria-describedby")).toBe(
			musicVolumeDescription.id,
		);
	});
});
