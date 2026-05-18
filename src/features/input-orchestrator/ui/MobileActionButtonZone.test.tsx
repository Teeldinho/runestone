// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
	INPUT_EVENT_TYPES,
	MOBILE_ACTION_BUTTON_COPY,
	MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES,
} from "../config";

import { MobileActionButtonZone } from "./MobileActionButtonZone";

const mockButton = vi.fn(
	({
		children,
		className,
		size,
		...props
	}: {
		readonly children?: ReactNode;
		readonly className?: string;
		readonly size?: string;
		readonly [key: string]: unknown;
	}) => (
		<button className={className} data-size={size} {...props}>
			{children}
		</button>
	),
);

vi.mock("@/shared/ui", () => ({
	Button: (props: unknown) => mockButton(props as never),
}));

afterEach(() => {
	cleanup();
});

describe("MobileActionButtonZone", () => {
	it("renders equal icon buttons and triggers actions on pointer down", () => {
		const sendInput = vi.fn();
		const { container } = render(
			<MobileActionButtonZone
				isJumpActive={false}
				isRunEnabled={false}
				sendInput={sendInput}
			/>,
		);
		const zoneRoot = container.firstElementChild as HTMLElement;

		const runButton = screen.getByRole("button", {
			name: MOBILE_ACTION_BUTTON_COPY.RUN_DISABLED_ARIA_LABEL,
		});
		const jumpButton = screen.getByRole("button", {
			name: MOBILE_ACTION_BUTTON_COPY.JUMP_ARIA_LABEL,
		});

		expect(runButton.getAttribute("data-size")).toBe("icon");
		expect(jumpButton.getAttribute("data-size")).toBe("icon");
		expect(runButton.className).toBe(jumpButton.className);
		expect(runButton.className).toBe(
			MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.BUTTON,
		);
		expect(zoneRoot.className).toBe(
			MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.ROOT,
		);
		expect(runButton.getAttribute("aria-pressed")).toBe("false");
		expect(jumpButton.getAttribute("aria-pressed")).toBe("false");

		fireEvent.pointerDown(runButton);
		expect(sendInput).toHaveBeenCalledWith({
			type: INPUT_EVENT_TYPES.RUN_TOGGLED,
		});

		fireEvent.pointerDown(jumpButton);
		expect(sendInput).toHaveBeenNthCalledWith(2, {
			type: INPUT_EVENT_TYPES.JUMP_PRESSED,
		});
		expect(sendInput).toHaveBeenCalledTimes(2);
	});

	it("reflects the enabled state in the run aria label and pressed state", () => {
		render(
			<MobileActionButtonZone
				isJumpActive={true}
				isRunEnabled={true}
				sendInput={vi.fn()}
			/>,
		);

		const runButton = screen.getByRole("button", {
			name: MOBILE_ACTION_BUTTON_COPY.RUN_ENABLED_ARIA_LABEL,
		});
		const jumpButton = screen.getByRole("button", {
			name: MOBILE_ACTION_BUTTON_COPY.JUMP_ARIA_LABEL,
		});

		expect(runButton.getAttribute("aria-pressed")).toBe("true");
		expect(jumpButton.getAttribute("aria-pressed")).toBe("true");
	});
});
