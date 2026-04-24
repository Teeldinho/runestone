import { useSyncExternalStore } from "react";

import type { SettingsValues } from "../lib";

import {
	getServerSettingsSnapshot,
	getSettingsSnapshot,
	subscribeToSettings,
} from "./settingsStore";

export const useSettingsValues = (): SettingsValues =>
	useSyncExternalStore(
		subscribeToSettings,
		getSettingsSnapshot,
		getServerSettingsSnapshot,
	);
