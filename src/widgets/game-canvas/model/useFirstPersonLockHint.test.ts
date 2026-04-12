// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";

import { useFirstPersonLockHint } from "./useFirstPersonLockHint";

describe("useFirstPersonLockHint", () => {
	it("shows the hint in first-person until pointer lock is active", () => {
		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: null,
		});

		const { result } = renderHook(() =>
			useFirstPersonLockHint({ mode: CAMERA_MODES.FIRST_PERSON }),
		);

		expect(result.current).toBe(true);

		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: document.body,
		});

		act(() => {
			document.dispatchEvent(new Event("pointerlockchange"));
		});

		expect(result.current).toBe(false);
	});

	it("does not show the hint outside first-person mode", () => {
		const { result } = renderHook(() =>
			useFirstPersonLockHint({ mode: CAMERA_MODES.FREE_ORBITAL }),
		);

		expect(result.current).toBe(false);
	});

	it("does not show the hint on touch devices even in first-person without pointer lock", () => {
		const originalMatchMedia = window.matchMedia;

		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: query === "(pointer: coarse)",
				media: query,
				onchange: null,
				addListener: vi.fn(), 
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});

		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: null,
		});

		const { result } = renderHook(() =>
			useFirstPersonLockHint({ mode: CAMERA_MODES.FIRST_PERSON }),
		);

		expect(result.current).toBe(false);

		window.matchMedia = originalMatchMedia;
	});
});
