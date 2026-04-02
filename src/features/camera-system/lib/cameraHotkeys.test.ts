import { describe, expect, it } from "vitest";

import { isCameraHotkey } from "./cameraHotkeys";

describe("isCameraHotkey", () => {
	it("returns true for valid camera hotkey strings", () => {
		expect(isCameraHotkey("1")).toBe(true);
		expect(isCameraHotkey("2")).toBe(true);
		expect(isCameraHotkey("3")).toBe(true);
		expect(isCameraHotkey("4")).toBe(true);
	});

	it("returns false for non-camera hotkey strings", () => {
		expect(isCameraHotkey("5")).toBe(false);
		expect(isCameraHotkey("a")).toBe(false);
		expect(isCameraHotkey("")).toBe(false);
	});
});
