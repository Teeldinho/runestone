// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { resolveCameraRigOrbitControlSurface } from "./resolveCameraRigOrbitControlSurface";

describe("resolveCameraRigOrbitControlSurface", () => {
	it("allows desktop orbit controls to use the default event surface", () => {
		expect(
			resolveCameraRigOrbitControlSurface({
				cameraControlElement: null,
				isDesktopLayout: true,
			}),
		).toEqual({
			domElement: undefined,
			shouldRenderOrbitControls: true,
		});
	});

	it("blocks mobile orbit controls until the dedicated surface exists", () => {
		expect(
			resolveCameraRigOrbitControlSurface({
				cameraControlElement: null,
				isDesktopLayout: false,
			}),
		).toEqual({
			domElement: undefined,
			shouldRenderOrbitControls: false,
		});
	});

	it("uses the dedicated mobile surface when it exists", () => {
		const cameraControlElement = document.createElement("div");

		expect(
			resolveCameraRigOrbitControlSurface({
				cameraControlElement,
				isDesktopLayout: false,
			}),
		).toEqual({
			domElement: cameraControlElement,
			shouldRenderOrbitControls: true,
		});
	});
});
