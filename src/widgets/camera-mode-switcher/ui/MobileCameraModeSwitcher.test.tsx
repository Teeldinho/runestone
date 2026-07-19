// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";
import { CAMERA_MODE_SWITCHER_OPTIONS } from "../config";

import { MobileCameraModeSwitcher } from "./MobileCameraModeSwitcher";

describe("MobileCameraModeSwitcher", () => {
	it("exposes full camera names on 44px abbreviated controls", () => {
		render(
			<MobileCameraModeSwitcher
				activeCameraMode={CAMERA_MODES.TOP_DOWN}
				handleCameraModeSwitch={vi.fn()}
			/>,
		);

		for (const option of CAMERA_MODE_SWITCHER_OPTIONS) {
			const button = screen.getByRole("button", { name: option.label });

			expect(button.className).toContain("size-11");
			expect(button.getAttribute("aria-pressed")).toBe(
				String(option.mode === CAMERA_MODES.TOP_DOWN),
			);
		}
	});
});
