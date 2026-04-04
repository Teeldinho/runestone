import { SETTINGS_DEFAULTS, SETTINGS_STORAGE_KEYS } from "../config";

export type SettingsValues = {
	masterVolume: number;
	musicVolume: number;
	hapticsEnabled: boolean;
	postprocessingEnabled: boolean;
};

type StorageAdapter = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max);

export const readSettings = (storage: StorageAdapter): SettingsValues => {
	const raw = storage.getItem(SETTINGS_STORAGE_KEYS.SETTINGS);

	if (!raw) {
		return { ...SETTINGS_DEFAULTS };
	}

	try {
		const parsed = JSON.parse(raw) as Partial<SettingsValues>;

		return {
			masterVolume:
				typeof parsed.masterVolume === "number"
					? clamp(parsed.masterVolume, 0, 1)
					: SETTINGS_DEFAULTS.masterVolume,
			musicVolume:
				typeof parsed.musicVolume === "number"
					? clamp(parsed.musicVolume, 0, 1)
					: SETTINGS_DEFAULTS.musicVolume,
			hapticsEnabled:
				typeof parsed.hapticsEnabled === "boolean"
					? parsed.hapticsEnabled
					: SETTINGS_DEFAULTS.hapticsEnabled,
			postprocessingEnabled:
				typeof parsed.postprocessingEnabled === "boolean"
					? parsed.postprocessingEnabled
					: SETTINGS_DEFAULTS.postprocessingEnabled,
		};
	} catch {
		return { ...SETTINGS_DEFAULTS };
	}
};

export const writeSettings = (
	storage: StorageAdapter,
	values: SettingsValues,
): void => {
	storage.setItem(SETTINGS_STORAGE_KEYS.SETTINGS, JSON.stringify(values));
};

export const resetSettings = (storage: StorageAdapter): void => {
	storage.removeItem(SETTINGS_STORAGE_KEYS.SETTINGS);
};

export type { StorageAdapter };
