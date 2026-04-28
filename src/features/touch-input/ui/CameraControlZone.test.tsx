// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CameraControlZone } from "./CameraControlZone";

describe("CameraControlZone", () => {
	it("spans the viewport so multi-touch camera gestures can start across the scene", () => {
		const zoneRef = vi.fn();

		render(<CameraControlZone zoneRef={zoneRef} />);
		const controlZone = document.querySelector("#camera-control-zone");

		expect(controlZone?.classList.contains("inset-0")).toBe(true);
		expect(controlZone?.classList.contains("right-0")).toBe(true);
	});
});
