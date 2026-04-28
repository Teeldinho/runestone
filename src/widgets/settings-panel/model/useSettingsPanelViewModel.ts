import { formatVolumePercent, useSettingsForm } from "@/features/settings";

export type SettingsPanelViewModel = {
	actions: {
		handleSettingsReset: () => void;
	};
	audio: {
		handleMasterVolumeSliderChange: (value: number[]) => void;
		handleMusicVolumeSliderChange: (value: number[]) => void;
		masterVolume: number;
		masterVolumeLabel: string;
		musicVolume: number;
		musicVolumeLabel: string;
	};
	graphics: {
		handlePostprocessingToggle: (enabled: boolean) => void;
		postprocessingEnabled: boolean;
	};
	haptics: {
		handleHapticsToggle: (enabled: boolean) => void;
		hapticsEnabled: boolean;
	};
};

export const useSettingsPanelViewModel = (): SettingsPanelViewModel => {
	const settings = useSettingsForm();

	return {
		actions: {
			handleSettingsReset: settings.handleSettingsReset,
		},
		audio: {
			handleMasterVolumeSliderChange: settings.handleMasterVolumeSliderChange,
			handleMusicVolumeSliderChange: settings.handleMusicVolumeSliderChange,
			masterVolume: settings.masterVolume,
			masterVolumeLabel: formatVolumePercent(settings.masterVolume),
			musicVolume: settings.musicVolume,
			musicVolumeLabel: formatVolumePercent(settings.musicVolume),
		},
		graphics: {
			handlePostprocessingToggle: settings.handlePostprocessingToggle,
			postprocessingEnabled: settings.postprocessingEnabled,
		},
		haptics: {
			handleHapticsToggle: settings.handleHapticsToggle,
			hapticsEnabled: settings.hapticsEnabled,
		},
	};
};
