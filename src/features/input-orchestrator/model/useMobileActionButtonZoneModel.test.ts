// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { MouseEvent, PointerEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { INPUT_EVENT_TYPES, MOBILE_ACTION_BUTTON_VARIANTS } from "../config";
import { useMobileActionButtonZoneModel } from "./useMobileActionButtonZoneModel";

const createPointerEvent = () =>
	({
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
		currentTarget: {
			setPointerCapture: vi.fn(),
		},
		pointerId: 1,
	}) as unknown as PointerEvent<HTMLButtonElement>;

const createMouseEvent = () =>
	({
		detail: 0,
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
	}) as unknown as MouseEvent<HTMLButtonElement>;

describe("useMobileActionButtonZoneModel", () => {
	it("sends run toggle from click and exposes the disabled aria label", () => {
		const sendInput = vi.fn();
		const { result } = renderHook(() =>
			useMobileActionButtonZoneModel({
				isRunEnabled: false,
				sendInput,
			}),
		);
		const event = createPointerEvent();

		result.current.handleRunPointerDown(event);
		result.current.handleRunClick(createMouseEvent());

		expect(event.stopPropagation).toHaveBeenCalledTimes(1);
		expect(sendInput).toHaveBeenCalledWith({
			type: INPUT_EVENT_TYPES.RUN_TOGGLED,
		});
		expect(result.current.runAriaLabel).toBe("Enable run");
		expect(result.current.jumpAriaLabel).toBe("Jump");
		expect(result.current.runButtonPressed).toBe(false);
		expect(result.current.runButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
		);
		expect(result.current.jumpButtonPressed).toBe(false);
		expect(result.current.jumpButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
		);
	});

	it("keeps jump momentary across pointer release and capture loss", () => {
		const sendInput = vi.fn();
		const { result } = renderHook(() =>
			useMobileActionButtonZoneModel({
				isRunEnabled: true,
				sendInput,
			}),
		);
		const event = createPointerEvent();

		act(() => {
			result.current.handleJumpPointerDown(event);
		});

		expect(event.currentTarget.setPointerCapture).toHaveBeenCalledWith(1);
		expect(event.stopPropagation).toHaveBeenCalledTimes(1);
		expect(sendInput).toHaveBeenCalledWith({
			type: INPUT_EVENT_TYPES.JUMP_PRESSED,
		});
		expect(result.current.jumpButtonPressed).toBe(true);
		expect(result.current.jumpButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.ACTIVE,
		);

		act(() => {
			result.current.handleJumpPointerUp();
		});

		expect(result.current.jumpButtonPressed).toBe(false);
		expect(result.current.jumpButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
		);

		act(() => {
			result.current.handleJumpPointerDown(event);
			result.current.handleJumpPointerCancel();
		});

		expect(result.current.jumpButtonPressed).toBe(false);
		expect(result.current.jumpButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
		);

		act(() => {
			result.current.handleJumpPointerDown(event);
			result.current.handleJumpLostPointerCapture();
		});

		expect(result.current.jumpButtonPressed).toBe(false);
		expect(result.current.jumpButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
		);
		expect(result.current.runAriaLabel).toBe("Disable run");
		expect(result.current.jumpAriaLabel).toBe("Jump");
		expect(result.current.runButtonPressed).toBe(true);
		expect(result.current.runButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.ACTIVE,
		);
	});

	it("sends jump from keyboard click without changing pressed state", () => {
		const sendInput = vi.fn();
		const { result } = renderHook(() =>
			useMobileActionButtonZoneModel({
				isRunEnabled: false,
				sendInput,
			}),
		);

		result.current.handleJumpClick(createMouseEvent());

		expect(sendInput).toHaveBeenCalledWith({
			type: INPUT_EVENT_TYPES.JUMP_PRESSED,
		});
		expect(result.current.jumpButtonPressed).toBe(false);
		expect(result.current.jumpButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.INACTIVE,
		);
	});
});
