import { describe, expect, it } from "vitest";

import { readSettings, resetSettings, writeSettings } from "./settingsStorage";

type MemoryStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const createMemoryStorage = (
	initialEntries: Record<string, string> = {},
): MemoryStorage => {
	const values = new Map(Object.entries(initialEntries));

	return {
		getItem: (key) => values.get(key) ?? null,
		setItem: (key, value) => {
			values.set(key, value);
		},
		removeItem: (key) => {
			values.delete(key);
		},
	};
};

describe("settingsStorage utilities", () => {
	it("returns default settings when storage is empty", () => {
		const storage = createMemoryStorage();

		expect(readSettings(storage)).toEqual({
			masterVolume: 0.8,
			musicVolume: 0.55,
			sfxVolume: 0.9,
			hapticsEnabled: true,
		});
	});

	it("returns merged settings from storage", () => {
		const storage = createMemoryStorage({
			rs_settings: JSON.stringify({ masterVolume: 0.5, hapticsEnabled: false }),
		});

		expect(readSettings(storage)).toEqual({
			masterVolume: 0.5,
			musicVolume: 0.55,
			sfxVolume: 0.9,
			hapticsEnabled: false,
		});
	});

	it("returns defaults on malformed JSON", () => {
		const storage = createMemoryStorage({ rs_settings: "not-json" });

		expect(readSettings(storage)).toEqual({
			masterVolume: 0.8,
			musicVolume: 0.55,
			sfxVolume: 0.9,
			hapticsEnabled: true,
		});
	});

	it("persists settings to storage", () => {
		const storage = createMemoryStorage();

		writeSettings(storage, {
			masterVolume: 0.3,
			musicVolume: 0.2,
			sfxVolume: 0.7,
			hapticsEnabled: false,
		});

		expect(readSettings(storage)).toEqual({
			masterVolume: 0.3,
			musicVolume: 0.2,
			sfxVolume: 0.7,
			hapticsEnabled: false,
		});
	});

	it("resets settings to defaults", () => {
		const storage = createMemoryStorage({
			rs_settings: JSON.stringify({ masterVolume: 0.1 }),
		});

		resetSettings(storage);

		expect(readSettings(storage)).toEqual({
			masterVolume: 0.8,
			musicVolume: 0.55,
			sfxVolume: 0.9,
			hapticsEnabled: true,
		});
	});

	it("ignores unknown keys from persisted data", () => {
		const storage = createMemoryStorage({
			rs_settings: JSON.stringify({ masterVolume: 0.6, unknownKey: true }),
		});

		const settings = readSettings(storage);
		expect(settings).toEqual({
			masterVolume: 0.6,
			musicVolume: 0.55,
			sfxVolume: 0.9,
			hapticsEnabled: true,
		});
		expect("unknownKey" in settings).toBe(false);
	});

	it("clamps volume values to valid range", () => {
		const storage = createMemoryStorage({
			rs_settings: JSON.stringify({ masterVolume: 1.5, musicVolume: -0.3 }),
		});

		expect(readSettings(storage).masterVolume).toBe(1);
		expect(readSettings(storage).musicVolume).toBe(0);
	});

	it("falls back to default masterVolume when field is missing", () => {
		const storage = createMemoryStorage({
			rs_settings: JSON.stringify({
				musicVolume: 0.4,
				sfxVolume: 0.6,
				hapticsEnabled: false,
			}),
		});

		expect(readSettings(storage).masterVolume).toBe(0.8);
	});
});
