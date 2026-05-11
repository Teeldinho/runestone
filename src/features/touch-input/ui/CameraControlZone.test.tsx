// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CameraControlZone } from "./CameraControlZone";

describe("CameraControlZone", () => {
	it("renders right-side look zone only", () => {
		const zoneRef = vi.fn();

		render(<CameraControlZone zoneRef={zoneRef} />);
		const controlZone = document.querySelector(
			"[data-input-pointer-role='look']",
		);

		expect(controlZone).toBeTruthy();
		expect(controlZone?.classList.contains("right-0")).toBe(true);
		expect(controlZone?.classList.contains("left-1/2")).toBe(true);
	});

	it("does not render children prop", () => {
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
