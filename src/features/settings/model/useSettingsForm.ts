import { useCallback, useState } from "react";

import {
	readSettings,
	resetSettings,
	type SettingsValues,
	writeSettings,
} from "../lib";

type UseSettingsFormResult = SettingsValues & {
	handleMasterVolumeChange: (value: number) => void;
	handleMusicVolumeChange: (value: number) => void;
	handleSfxVolumeChange: (value: number) => void;
	handleHapticsToggle: (enabled: boolean) => void;
	handlePostprocessingToggle: (enabled: boolean) => void;
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

	const handleSfxVolumeChange = useCallback(
		(value: number) => {
			persist({ ...settings, sfxVolume: value });
		},
		[settings, persist],
	);

	const handleHapticsToggle = useCallback(
		(enabled: boolean) => {
			persist({ ...settings, hapticsEnabled: enabled });
		},
		[settings, persist],
	);

	const handlePostprocessingToggle = useCallback(
		(enabled: boolean) => {
			persist({ ...settings, postprocessingEnabled: enabled });
		},
		[settings, persist],
	);

	const handleSettingsReset = useCallback(() => {
		resetSettings(localStorage);
		const defaults = readSettings(localStorage);
		setSettings(defaults);
	}, []);

	return {
		...settings,
		handleMasterVolumeChange,
		handleMusicVolumeChange,
		handleSfxVolumeChange,
		handleHapticsToggle,
		handlePostprocessingToggle,
		handleSettingsReset,
	};
};
