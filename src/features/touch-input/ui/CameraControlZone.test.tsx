// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CameraControlZone } from "./CameraControlZone";

describe("CameraControlZone", () => {
	it("renders full-screen childless look zone", () => {
		const zoneRef = vi.fn();

		render(<CameraControlZone zoneRef={zoneRef} />);
		const controlZone = document.querySelector(
			"[data-input-pointer-role='look']",
		);

		expect(controlZone).toBeTruthy();
		expect(controlZone?.childElementCount).toBe(0);
		expect(controlZone?.classList.contains("inset-0")).toBe(true);
	});

	it("does not require pointer handlers", () => {
		const zoneRef = vi.fn();

		const { container } = render(<CameraControlZone zoneRef={zoneRef} />);

		expect(
			container.querySelector("[data-input-pointer-role='look']"),
		).toBeTruthy();
	});

	it("handlers are optional", () => {
		const zoneRef = vi.fn();

		render(<CameraControlZone zoneRef={zoneRef} />);
		const controlZone = document.querySelector(
			"[data-input-pointer-role='look']",
		);

		expect(controlZone).toBeTruthy();
	});
});
