// @vitest-environment happy-dom

import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SETTINGS_COPY } from "@/features/settings";
import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/ui";

import { SETTINGS_PANEL_IDS } from "../config/settingsPanelConfig";
import { SettingsSheet } from "./SettingsSheet";

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

afterEach(() => {
	cleanup();
});

describe("SettingsSheet", () => {
	it("opens the settings panel from the trigger and keeps it accessible", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<SettingsSheet>
						<TooltipTrigger asChild>
							<Button type="button">Open Settings</Button>
						</TooltipTrigger>
					</SettingsSheet>
					<TooltipContent>{SETTINGS_COPY.PAGE_TITLE}</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(screen.queryByRole("dialog")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Open Settings" }));

		expect(
			screen.getByRole("dialog", { name: SETTINGS_COPY.PAGE_TITLE }),
		).toBeTruthy();

		const dialog = screen.getByRole("dialog", {
			name: SETTINGS_COPY.PAGE_TITLE,
		});
		const dialogQueries = within(dialog);
		const sheetHeader = dialogQueries
			.getByText(SETTINGS_COPY.PAGE_TITLE)
			.closest('[data-slot="sheet-header"]');

		expect(sheetHeader?.className).not.toContain("sr-only");
		expect(
			dialogQueries.getByText(SETTINGS_COPY.PAGE_DESCRIPTION),
		).toBeTruthy();
		expect(dialog.querySelector('[data-slot="card"]')).toBeNull();
		expect(
			dialogQueries.getByRole("region", {
				name: SETTINGS_COPY.AUDIO_SECTION,
			}),
		).toBeTruthy();
		expect(
			dialogQueries.getByRole("region", {
				name: SETTINGS_COPY.GRAPHICS_SECTION,
			}),
		).toBeTruthy();
		expect(
			dialogQueries.getByRole("region", {
				name: SETTINGS_COPY.HAPTICS_SECTION,
			}),
		).toBeTruthy();
		expect(
			dialog.querySelector(`#${SETTINGS_PANEL_IDS.MASTER_VOLUME_CONTROL}`),
		).not.toBeNull();
		expect(
			dialog.querySelector(
				`label[for="${SETTINGS_PANEL_IDS.POSTPROCESSING_TOGGLE}"]`,
			),
		).not.toBeNull();
		expect(
			dialog.querySelector(`label[for="${SETTINGS_PANEL_IDS.HAPTICS_TOGGLE}"]`),
		).not.toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Close" }));

		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
