import { describe, expect, it } from "vitest";

import { shouldRenderOrbitControls } from "./shouldRenderOrbitControls";

describe("shouldRenderOrbitControls", () => {
	it("returns true on desktop without a dedicated look element", () => {
		expect(
			shouldRenderOrbitControls({
				cameraControlElement: null,
				isDesktopLayout: true,
			}),
		).toBe(true);
	});

	it("returns false on mobile before the look surface exists", () => {
		expect(
			shouldRenderOrbitControls({
				cameraControlElement: null,
				isDesktopLayout: false,
			}),
		).toBe(false);
	});

	it("returns true on mobile once the dedicated look surface exists", () => {
		const cameraControlElement = {} as HTMLElement;

		expect(
			shouldRenderOrbitControls({
				cameraControlElement,
				isDesktopLayout: false,
			}),
		).toBe(true);
	});
});
