import { SETTINGS_DEFAULTS, SETTINGS_STORAGE_KEYS } from "../config";

export type SettingsValues = {
	masterVolume: number;
	musicVolume: number;
	sfxVolume: number;
	hapticsEnabled: boolean;
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
			sfxVolume:
				typeof parsed.sfxVolume === "number"
					? clamp(parsed.sfxVolume, 0, 1)
					: SETTINGS_DEFAULTS.sfxVolume,
			hapticsEnabled:
				typeof parsed.hapticsEnabled === "boolean"
					? parsed.hapticsEnabled
					: SETTINGS_DEFAULTS.hapticsEnabled,
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
