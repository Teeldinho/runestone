import { useCallback, useState } from "react";

import {
	readSettings,
	resetSettings,
	type SettingsValues,
	writeSettings,
} from "../lib";

type UseSettingsFormResult = SettingsValues & {
	handleMasterVolumeSliderChange: (value: number[]) => void;
	handleMusicVolumeSliderChange: (value: number[]) => void;
	handleHapticsToggle: (enabled: boolean) => void;
	handleHapticsToggleClick: () => void;
	handleMasterVolumeChange: (value: number) => void;
	handleMusicVolumeChange: (value: number) => void;
	handlePostprocessingToggle: (enabled: boolean) => void;
	handlePostprocessingToggleClick: () => void;
	handleSettingsReset: () => void;
};

export const useSettingsForm = (): UseSettingsFormResult => {
	const [settings, setSettings] = useState<SettingsValues>(() =>
		readSettings(localStorage),
	);

	const persist = useCallback((next: SettingsValues) => {
		setSettings(next);
		writeSettings(localStorage, next);
	}, []);

	const handleMasterVolumeSliderChange = useCallback(
		(value: number[]) => {
			persist({ ...settings, masterVolume: value[0] ?? 0 });
		},
		[settings, persist],
	);

	const handleMusicVolumeSliderChange = useCallback(
		(value: number[]) => {
			persist({ ...settings, musicVolume: value[0] ?? 0 });
		},
		[settings, persist],
	);

	const handleMasterVolumeChange = useCallback(
		(value: number) => {
			persist({ ...settings, masterVolume: value });
		},
		[settings, persist],
	);

	const handleMusicVolumeChange = useCallback(
		(value: number) => {
			persist({ ...settings, musicVolume: value });
		},
		[settings, persist],
	);

	const handlePostprocessingToggle = useCallback(
		(enabled: boolean) => {
			persist({ ...settings, postprocessingEnabled: enabled });
		},
		[settings, persist],
	);

	const handlePostprocessingToggleClick = useCallback(() => {
		persist({ ...settings, postprocessingEnabled: !settings.postprocessingEnabled });
	}, [settings, persist]);

	const handleHapticsToggle = useCallback(
		(enabled: boolean) => {
			persist({ ...settings, hapticsEnabled: enabled });
		},
		[settings, persist],
	);

	const handleHapticsToggleClick = useCallback(() => {
		persist({ ...settings, hapticsEnabled: !settings.hapticsEnabled });
	}, [settings, persist]);

	const handleSettingsReset = useCallback(() => {
		resetSettings(localStorage);
		const defaults = readSettings(localStorage);
		setSettings(defaults);
	}, []);

	return {
		...settings,
		handleMasterVolumeChange,
		handleMasterVolumeSliderChange,
		handleMusicVolumeChange,
		handleMusicVolumeSliderChange,
		handleHapticsToggle,
		handleHapticsToggleClick,
		handlePostprocessingToggle,
		handlePostprocessingToggleClick,
		handleSettingsReset,
	};
};
