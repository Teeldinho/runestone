// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { INPUT_POINTER_DATA_ATTRIBUTES, POINTER_ROLES } from "@/shared/config";

import { CameraControlZone } from "./CameraControlZone";

describe("CameraControlZone", () => {
	it("renders a full-screen camera surface", () => {
		const zoneRef = vi.fn();

		const { container } = render(<CameraControlZone zoneRef={zoneRef} />);
		const controlZone = container.querySelector(
			`[${INPUT_POINTER_DATA_ATTRIBUTES.ROLE}='${POINTER_ROLES.LOOK}']`,
		);

		expect(controlZone).toBeTruthy();
		expect(controlZone?.childElementCount).toBe(0);
		expect(controlZone?.classList.contains("inset-0")).toBe(true);
	});
});
