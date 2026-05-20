// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type CameraControlsImpl from "camera-controls";
import type { RefObject } from "react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_MODE_IDS, type CameraModeId } from "../config";
import { useFirstPersonPointerLock } from "./useFirstPersonPointerLock";

describe("useFirstPersonPointerLock", () => {
	it("locks the pointer when desktop first-person canvas is pressed", () => {
		const canvas = document.createElement("canvas");
		const lockPointer = vi.fn();

		const controlsRef = {
			current: {
				lockPointer,
			},
		} as unknown as RefObject<CameraControlsImpl | null>;

		renderHook(() =>
			useFirstPersonPointerLock({
				controlsRef,
				domElement: canvas,
				isDesktopLayout: true,
				mode: CAMERA_MODE_IDS.FIRST_PERSON,
			}),
		);

		act(() => {
			canvas.dispatchEvent(new PointerEvent("pointerdown"));
		});

		expect(lockPointer).toHaveBeenCalledTimes(1);
	});

	it("does not lock pointer on mobile or tablet", () => {
		const canvas = document.createElement("canvas");
		const lockPointer = vi.fn();

		const controlsRef = {
			current: {
				lockPointer,
			},
		} as unknown as RefObject<CameraControlsImpl | null>;

		renderHook(() =>
			useFirstPersonPointerLock({
				controlsRef,
				domElement: canvas,
				isDesktopLayout: false,
				mode: CAMERA_MODE_IDS.FIRST_PERSON,
			}),
		);

		act(() => {
			canvas.dispatchEvent(new PointerEvent("pointerdown"));
		});

		expect(lockPointer).not.toHaveBeenCalled();
	});

	it("exits pointer lock when leaving first-person", () => {
		const canvas = document.createElement("canvas");
		const exitPointerLock = vi.fn();

		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: canvas,
		});

		Object.defineProperty(document, "exitPointerLock", {
			configurable: true,
			value: exitPointerLock,
		});

		const { rerender } = renderHook<void, { mode: CameraModeId }>(
			({ mode }: { mode: CameraModeId }) =>
				useFirstPersonPointerLock({
					controlsRef: { current: null },
					domElement: canvas,
					isDesktopLayout: true,
					mode,
				}),
			{
				initialProps: {
					mode: CAMERA_MODE_IDS.FIRST_PERSON,
				},
			},
		);

		rerender({
			mode: CAMERA_MODE_IDS.THIRD_PERSON,
		});

		expect(exitPointerLock).toHaveBeenCalledTimes(1);
	});

	it("exits pointer lock on unmount", () => {
		const canvas = document.createElement("canvas");
		const exitPointerLock = vi.fn();

		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: canvas,
		});

		Object.defineProperty(document, "exitPointerLock", {
			configurable: true,
			value: exitPointerLock,
		});

		const { unmount } = renderHook(() =>
			useFirstPersonPointerLock({
				controlsRef: { current: null },
				domElement: canvas,
				isDesktopLayout: true,
				mode: CAMERA_MODE_IDS.FIRST_PERSON,
			}),
		);

		unmount();
		expect(exitPointerLock).toHaveBeenCalledTimes(1);
	});
});
