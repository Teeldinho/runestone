// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SETTINGS_COPY } from "@/features/settings";

import { SETTINGS_PANEL_IDS } from "../config/settingsPanelConfig";

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
			postprocessingEnabled: false,
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
	it("renders the panel sections and preserves landmark wiring", () => {
		const { container } = render(<SettingsPanel />);

		expect(container.querySelector('[data-slot="card"]')).not.toBeNull();
		expect(screen.getByText(SETTINGS_COPY.PAGE_TITLE)).toBeTruthy();
		expect(screen.getByText(SETTINGS_COPY.PAGE_DESCRIPTION)).toBeTruthy();
		expect(screen.getByText(SETTINGS_COPY.AUDIO_SECTION)).toBeTruthy();
		expect(screen.getByText(SETTINGS_COPY.GRAPHICS_SECTION)).toBeTruthy();
		expect(screen.getByText(SETTINGS_COPY.HAPTICS_SECTION)).toBeTruthy();
		expect(
			screen.getByRole("region", { name: SETTINGS_COPY.AUDIO_SECTION }),
		).toBeTruthy();
		expect(
			screen.getByRole("region", { name: SETTINGS_COPY.GRAPHICS_SECTION }),
		).toBeTruthy();
		expect(
			screen.getByRole("region", { name: SETTINGS_COPY.HAPTICS_SECTION }),
		).toBeTruthy();
		expect(
			screen.getByRole("button", { name: SETTINGS_COPY.RESET_BUTTON }),
		).toBeTruthy();

		const masterVolumeSlider = container.querySelector(
			`#${SETTINGS_PANEL_IDS.MASTER_VOLUME_CONTROL}`,
		) as HTMLElement | null;
		expect(masterVolumeSlider).not.toBeNull();
		expect(
			container.querySelector(
				`label[for="${SETTINGS_PANEL_IDS.MASTER_VOLUME_CONTROL}"]`,
			),
		).not.toBeNull();
		const masterVolumeDescription = screen.getByText("80%");
		expect(masterVolumeSlider?.getAttribute("aria-describedby")).toBe(
			masterVolumeDescription.id,
		);

		const musicVolumeSlider = container.querySelector(
			`#${SETTINGS_PANEL_IDS.MUSIC_VOLUME_CONTROL}`,
		) as HTMLElement | null;
		expect(musicVolumeSlider).not.toBeNull();
		expect(
			container.querySelector(
				`label[for="${SETTINGS_PANEL_IDS.MUSIC_VOLUME_CONTROL}"]`,
			),
		).not.toBeNull();
		const musicVolumeDescription = screen.getByText("55%");
		expect(musicVolumeSlider?.getAttribute("aria-describedby")).toBe(
			musicVolumeDescription.id,
		);

		expect(
			container.querySelector(
				`label[for="${SETTINGS_PANEL_IDS.POSTPROCESSING_TOGGLE}"]`,
			),
		).not.toBeNull();
		expect(
			container.querySelector(
				`label[for="${SETTINGS_PANEL_IDS.HAPTICS_TOGGLE}"]`,
			),
		).not.toBeNull();
		expect(
			screen.getByRole("switch", {
				name: SETTINGS_COPY.POSTPROCESSING_TOGGLE_LABEL,
			}),
		).toBeTruthy();
		expect(
			screen.getByRole("switch", {
				name: SETTINGS_COPY.HAPTICS_TOGGLE_LABEL,
			}),
		).toBeTruthy();
	});
});
