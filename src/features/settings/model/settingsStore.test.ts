// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetSettingsStore } from "./settingsStore";
import { useSettingsForm } from "./useSettingsForm";
import { useSettingsValues } from "./useSettingsValues";

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

describe("settingsStore", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	beforeEach(() => {
		vi.stubGlobal("localStorage", createMemoryStorage());
		resetSettingsStore();
		localStorage.clear();
	});

	it("keeps mounted consumers synchronized after writes and reset", () => {
		const formHook = renderHook(() => useSettingsForm());
		const valuesHook = renderHook(() => useSettingsValues());

		expect(valuesHook.result.current.postprocessingEnabled).toBe(false);

		act(() => {
			formHook.result.current.handlePostprocessingToggle(false);
		});

		expect(formHook.result.current.postprocessingEnabled).toBe(false);
		expect(valuesHook.result.current.postprocessingEnabled).toBe(false);

		act(() => {
			formHook.result.current.handleSettingsReset();
		});

		expect(formHook.result.current.postprocessingEnabled).toBe(false);
		expect(valuesHook.result.current.postprocessingEnabled).toBe(false);
		expect(valuesHook.result.current.hapticsEnabled).toBe(true);
	});
});
