// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SETTINGS_STORAGE_KEYS } from "../config";
import { resetSettingsStore } from "./settingsStore";
import { useSettingsForm } from "./useSettingsForm";

type MemoryStorage = Pick<
	Storage,
	"clear" | "getItem" | "removeItem" | "setItem"
>;

const createMemoryStorage = (): MemoryStorage => {
	const values = new Map<string, string>();

	return {
		clear: () => {
			values.clear();
		},
		getItem: (key) => values.get(key) ?? null,
		removeItem: (key) => {
			values.delete(key);
		},
		setItem: (key, value) => {
			values.set(key, value);
		},
	};
};

const readPersistedSettings = (): Record<string, unknown> | null => {
	const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEYS.SETTINGS);

	return rawSettings
		? (JSON.parse(rawSettings) as Record<string, unknown>)
		: null;
};

describe("useSettingsForm", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	beforeEach(() => {
		vi.stubGlobal("localStorage", createMemoryStorage());
		resetSettingsStore();
		localStorage.clear();
	});

	it("returns default settings on initial load", () => {
		const { result } = renderHook(() => useSettingsForm());

		expect(result.current.masterVolume).toBe(0.8);
		expect(result.current.musicVolume).toBe(0.55);
		expect(result.current.hapticsEnabled).toBe(true);
		expect(result.current.postprocessingEnabled).toBe(true);
	});

	it("updates master volume and persists", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleMasterVolumeChange(0.5);
		});

		expect(result.current.masterVolume).toBe(0.5);
		expect(readPersistedSettings()).toMatchObject({ masterVolume: 0.5 });
	});

	it("updates music volume and persists", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleMusicVolumeChange(0.4);
		});

		expect(result.current.musicVolume).toBe(0.4);
		expect(readPersistedSettings()).toMatchObject({ musicVolume: 0.4 });
	});

	it("toggles postprocessing and persists", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handlePostprocessingToggle(false);
		});

		expect(result.current.postprocessingEnabled).toBe(false);
		expect(readPersistedSettings()).toMatchObject({
			postprocessingEnabled: false,
		});
	});

	it("toggles haptics and persists", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleHapticsToggle(false);
		});

		expect(result.current.hapticsEnabled).toBe(false);
		expect(readPersistedSettings()).toMatchObject({ hapticsEnabled: false });
	});

	it("resets to defaults and clears persisted settings", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleMasterVolumeChange(0.5);
			result.current.handleSettingsReset();
		});

		expect(result.current.masterVolume).toBe(0.8);
		expect(result.current.hapticsEnabled).toBe(true);
		expect(localStorage.getItem(SETTINGS_STORAGE_KEYS.SETTINGS)).toBeNull();
	});
});
