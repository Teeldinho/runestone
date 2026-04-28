// @vitest-environment happy-dom

import { describe, expect, it, vi } from "vitest";

import { createCameraRigFirstPersonBindings } from "./createCameraRigFirstPersonBindings";

describe("createCameraRigFirstPersonBindings", () => {
	it("preserves the first-person look element and handlers", () => {
		const firstPersonLookElement = document.createElement("button");
		const handleFirstPersonLock = vi.fn();
		const handleFirstPersonUnlock = vi.fn();
		const handleOrbitStart = vi.fn();
		const handleOrbitEnd = vi.fn();

		const bindings = createCameraRigFirstPersonBindings({
			firstPersonLookElement,
			handleFirstPersonLock,
			handleFirstPersonUnlock,
			handleOrbitEnd,
			handleOrbitStart,
		});

		expect(bindings).toEqual({
			firstPersonLookElement,
			handleFirstPersonLock,
			handleFirstPersonUnlock,
			handleOrbitEnd,
			handleOrbitStart,
		});
	});
});
