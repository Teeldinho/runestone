// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import type { PointerEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { INPUT_EVENT_TYPES, MOBILE_ACTION_BUTTON_VARIANTS } from "../config";
import { useMobileActionButtonZoneModel } from "./useMobileActionButtonZoneModel";

const createPointerEvent = () =>
	({
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
	}) as unknown as PointerEvent<HTMLButtonElement>;

describe("useMobileActionButtonZoneModel", () => {
	it("sends run toggle from click and exposes the disabled aria label", () => {
		const sendInput = vi.fn();
		const { result } = renderHook(() =>
			useMobileActionButtonZoneModel({
				isJumpActive: false,
				isRunEnabled: false,
				sendInput,
			}),
		);
		const event = createPointerEvent();

		result.current.handleButtonPointerDown(event);
		result.current.handleRunClick();

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

	it("sends jump from click and exposes the enabled aria label", () => {
		const sendInput = vi.fn();
		const { result } = renderHook(() =>
			useMobileActionButtonZoneModel({
				isJumpActive: true,
				isRunEnabled: true,
				sendInput,
			}),
		);
		const event = createPointerEvent();

		result.current.handleButtonPointerDown(event);
		result.current.handleJumpClick();

		expect(event.stopPropagation).toHaveBeenCalledTimes(1);
		expect(sendInput).toHaveBeenCalledWith({
			type: INPUT_EVENT_TYPES.JUMP_PRESSED,
		});
		expect(result.current.runAriaLabel).toBe("Disable run");
		expect(result.current.jumpAriaLabel).toBe("Jump");
		expect(result.current.runButtonPressed).toBe(true);
		expect(result.current.runButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.ACTIVE,
		);
		expect(result.current.jumpButtonPressed).toBe(true);
		expect(result.current.jumpButtonVariant).toBe(
			MOBILE_ACTION_BUTTON_VARIANTS.ACTIVE,
		);
	});
});
