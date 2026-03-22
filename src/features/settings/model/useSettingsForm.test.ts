// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSettingsForm } from "./useSettingsForm";

const { mockWriteSettings, mockResetSettings, mockReadSettings } = vi.hoisted(
	() => ({
		mockWriteSettings: vi.fn(),
		mockResetSettings: vi.fn(),
		mockReadSettings: vi.fn(() => ({
			masterVolume: 0.8,
			musicVolume: 0.55,
			sfxVolume: 0.9,
			hapticsEnabled: true,
		})),
	}),
);

vi.mock("../lib", () => ({
	readSettings: mockReadSettings,
	writeSettings: mockWriteSettings,
	resetSettings: mockResetSettings,
}));

describe("useSettingsForm", () => {
	it("returns default settings on initial load", () => {
		const { result } = renderHook(() => useSettingsForm());

		expect(result.current.masterVolume).toBe(0.8);
		expect(result.current.musicVolume).toBe(0.55);
		expect(result.current.sfxVolume).toBe(0.9);
		expect(result.current.hapticsEnabled).toBe(true);
	});

	it("updates master volume and persists", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleMasterVolumeChange(0.5);
		});

		expect(result.current.masterVolume).toBe(0.5);
		expect(mockWriteSettings).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ masterVolume: 0.5 }),
		);
	});

	it("toggles haptics and persists", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleHapticsToggle(false);
		});

		expect(result.current.hapticsEnabled).toBe(false);
		expect(mockWriteSettings).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ hapticsEnabled: false }),
		);
	});

	it("resets to defaults", () => {
		const { result } = renderHook(() => useSettingsForm());

		act(() => {
			result.current.handleSettingsReset();
		});

		expect(mockResetSettings).toHaveBeenCalled();
		expect(result.current.masterVolume).toBe(0.8);
		expect(result.current.hapticsEnabled).toBe(true);
	});
});
