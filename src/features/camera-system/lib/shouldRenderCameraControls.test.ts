// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { shouldRenderCameraControls } from "./shouldRenderCameraControls";

describe("shouldRenderCameraControls", () => {
	it("renders on desktop", () => {
		expect(
			shouldRenderCameraControls({
				isDesktopLayout: true,
			}),
		).toBe(true);
	});

	it("renders on mobile when the camera control element exists", () => {
		expect(
			shouldRenderCameraControls({
				cameraControlElement: document.createElement("div"),
				isDesktopLayout: false,
			}),
		).toBe(true);
	});

	it("does not render on mobile without a camera control element", () => {
		expect(
			shouldRenderCameraControls({
				isDesktopLayout: false,
			}),
		).toBe(false);
	});
});
