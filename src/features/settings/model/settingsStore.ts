import {
	SETTINGS_DEFAULTS,
	SETTINGS_STORAGE_KEYS,
	SETTINGS_VOLUME_RANGE,
} from "../config";
import {
	readSettings,
	resetSettings,
	type SettingsValues,
	writeSettings,
} from "../lib";

type SettingsListener = () => void;

const createDefaultSettings = (): SettingsValues => ({ ...SETTINGS_DEFAULTS });

const clampVolume = (value: number): number =>
	Math.min(
		Math.max(value, SETTINGS_VOLUME_RANGE.MIN),
		SETTINGS_VOLUME_RANGE.MAX,
	);

let currentSettings: SettingsValues = createDefaultSettings();
let isHydrated = false;
let isStorageListenerAttached = false;
const listeners = new Set<SettingsListener>();

const getLocalStorage = (): Storage | null => {
	try {
		const storage = globalThis.localStorage;

		if (
			!storage ||
			typeof storage.getItem !== "function" ||
			typeof storage.setItem !== "function" ||
			typeof storage.removeItem !== "function"
		) {
			return null;
		}

		return storage;
	} catch {
		return null;
	}
};

const emitSettingsChange = (): void => {
	for (const listener of listeners) {
		listener();
	}
};

const hydrateSettings = (): SettingsValues => {
	if (isHydrated) {
		return currentSettings;
	}

	const storage = getLocalStorage();

	currentSettings = storage ? readSettings(storage) : createDefaultSettings();
	isHydrated = true;

	return currentSettings;
};

const persistSettings = (nextSettings: SettingsValues): void => {
	const storage = getLocalStorage();

	currentSettings = nextSettings;
	isHydrated = true;

	if (storage) {
		try {
			writeSettings(storage, nextSettings);
		} catch {
			// Ignore storage failures and keep the in-memory snapshot current.
		}
	}

	emitSettingsChange();
};

const restoreDefaultSettings = (): void => {
	const storage = getLocalStorage();

	currentSettings = createDefaultSettings();
	isHydrated = true;

	if (storage) {
		try {
			resetSettings(storage);
		} catch {
			// Ignore storage failures and keep the in-memory snapshot current.
		}
	}

	emitSettingsChange();
};

const syncSettingsFromStorage = (): void => {
	const storage = getLocalStorage();

	currentSettings = storage ? readSettings(storage) : createDefaultSettings();
	isHydrated = true;
};

const handleStorageEvent = (event: StorageEvent): void => {
	if (event.key !== SETTINGS_STORAGE_KEYS.SETTINGS && event.key !== null) {
		return;
	}

	syncSettingsFromStorage();
	emitSettingsChange();
};

const attachStorageListener = (): void => {
	if (isStorageListenerAttached || typeof window === "undefined") {
		return;
	}

	window.addEventListener("storage", handleStorageEvent);
	isStorageListenerAttached = true;
};

const detachStorageListener = (): void => {
	if (
		!isStorageListenerAttached ||
		typeof window === "undefined" ||
		listeners.size > 0
	) {
		return;
	}

	window.removeEventListener("storage", handleStorageEvent);
	isStorageListenerAttached = false;
};

export const getSettingsSnapshot = (): SettingsValues => hydrateSettings();

export const getServerSettingsSnapshot = (): SettingsValues =>
	createDefaultSettings();

export const subscribeToSettings = (
	listener: SettingsListener,
): (() => void) => {
	listeners.add(listener);
	attachStorageListener();
	hydrateSettings();

	return () => {
		listeners.delete(listener);
		detachStorageListener();
	};
};

export const setMasterVolumeSetting = (masterVolume: number): void => {
	persistSettings({
		...hydrateSettings(),
		masterVolume: clampVolume(masterVolume),
	});
};

export const setMusicVolumeSetting = (musicVolume: number): void => {
	persistSettings({
		...hydrateSettings(),
		musicVolume: clampVolume(musicVolume),
	});
};

export const setHapticsEnabledSetting = (hapticsEnabled: boolean): void => {
	persistSettings({
		...hydrateSettings(),
		hapticsEnabled,
	});
};

export const setPostprocessingEnabledSetting = (
	postprocessingEnabled: boolean,
): void => {
	persistSettings({
		...hydrateSettings(),
		postprocessingEnabled,
	});
};

export const toggleHapticsEnabledSetting = (): void => {
	const settings = hydrateSettings();

	persistSettings({
		...settings,
		hapticsEnabled: !settings.hapticsEnabled,
	});
};

export const togglePostprocessingEnabledSetting = (): void => {
	const settings = hydrateSettings();

	persistSettings({
		...settings,
		postprocessingEnabled: !settings.postprocessingEnabled,
	});
};

export const resetSettingsStore = (): void => {
	restoreDefaultSettings();
};
