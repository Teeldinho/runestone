// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CameraControlZone } from "./CameraControlZone";

describe("CameraControlZone", () => {
	it("restricts touch camera controls to the right half of the viewport", () => {
		const zoneRef = vi.fn();

		render(<CameraControlZone zoneRef={zoneRef} />);
		const controlZone = document.querySelector("#camera-control-zone");

		expect(controlZone?.classList.contains("left-1/2")).toBe(true);
		expect(controlZone?.classList.contains("right-0")).toBe(true);
	});
});
