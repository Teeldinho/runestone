import { useCallback } from "react";

import { SETTINGS_VOLUME_RANGE } from "../config";
import type { SettingsValues } from "../lib";

import {
	resetSettingsStore,
	setHapticsEnabledSetting,
	setMasterVolumeSetting,
	setMusicVolumeSetting,
	setPostprocessingEnabledSetting,
	toggleHapticsEnabledSetting,
	togglePostprocessingEnabledSetting,
} from "./settingsStore";
import { useSettingsValues } from "./useSettingsValues";

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
	const settings = useSettingsValues();

	const handleMasterVolumeSliderChange = useCallback((value: number[]) => {
		setMasterVolumeSetting(value[0] ?? SETTINGS_VOLUME_RANGE.MIN);
	}, []);

	const handleMusicVolumeSliderChange = useCallback((value: number[]) => {
		setMusicVolumeSetting(value[0] ?? SETTINGS_VOLUME_RANGE.MIN);
	}, []);

	const handleMasterVolumeChange = useCallback((value: number) => {
		setMasterVolumeSetting(value);
	}, []);

	const handleMusicVolumeChange = useCallback((value: number) => {
		setMusicVolumeSetting(value);
	}, []);

	const handlePostprocessingToggle = useCallback((enabled: boolean) => {
		setPostprocessingEnabledSetting(enabled);
	}, []);

	const handlePostprocessingToggleClick = useCallback(() => {
		togglePostprocessingEnabledSetting();
	}, []);

	const handleHapticsToggle = useCallback((enabled: boolean) => {
		setHapticsEnabledSetting(enabled);
	}, []);

	const handleHapticsToggleClick = useCallback(() => {
		toggleHapticsEnabledSetting();
	}, []);

	const handleSettingsReset = useCallback(() => {
		resetSettingsStore();
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
