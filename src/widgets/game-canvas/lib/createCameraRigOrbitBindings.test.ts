// @vitest-environment happy-dom

import { describe, expect, it, vi } from "vitest";

import { createCameraRigOrbitBindings } from "./createCameraRigOrbitBindings";

describe("createCameraRigOrbitBindings", () => {
	it("preserves the camera control element and orbit handlers", () => {
		const cameraControlElement = document.createElement("button");
		const handleOrbitStart = vi.fn();
		const handleOrbitEnd = vi.fn();

		const bindings = createCameraRigOrbitBindings({
			cameraControlElement,
			handleOrbitEnd,
			handleOrbitStart,
		});

		expect(bindings).toEqual({
			cameraControlElement,
			handleOrbitEnd,
			handleOrbitStart,
		});
	});
});
