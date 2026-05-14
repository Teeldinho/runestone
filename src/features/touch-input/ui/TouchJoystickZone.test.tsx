// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TOUCH_JOYSTICK_CONFIG } from "../config";
import { TouchJoystickZone } from "./TouchJoystickZone";

vi.mock("../model", () => ({
	useTouchJoystickInput: () => ({
		handlePointerCancel: vi.fn(),
		handlePointerDown: vi.fn(),
		handlePointerMove: vi.fn(),
		handlePointerUp: vi.fn(),
		isActive: false,
		joystickRef: vi.fn(),
		knobOffsetX: 0,
		knobOffsetY: 0,
	}),
}));

describe("TouchJoystickZone", () => {
	it("uses joystick sizing from config", () => {
		const { container } = render(
			<TouchJoystickZone onMoveVelocity={vi.fn()} onStopVelocity={vi.fn()} />,
		);
		const joystick = container.firstElementChild as HTMLElement;
		const knob = joystick.lastElementChild as HTMLElement;

		expect(joystick.style.height).toBe(
			`${TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX}px`,
		);
		expect(joystick.style.width).toBe(
			`${TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX}px`,
		);
		expect(knob.style.height).toBe(`${TOUCH_JOYSTICK_CONFIG.KNOB_SIZE_PX}px`);
		expect(knob.style.width).toBe(`${TOUCH_JOYSTICK_CONFIG.KNOB_SIZE_PX}px`);
	});
});
