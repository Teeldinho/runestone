// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockRunestoneCameraControls = vi.fn((_props: unknown) => (
	<div data-testid="runestone-camera-controls" />
));

vi.mock("@/features/camera-system", () => ({
	RunestoneCameraControls: (props: unknown) =>
		mockRunestoneCameraControls(props),
}));

import { CameraRig } from "./CameraRig";

const TEST_CAMERA_SNAPSHOT = {
	distance: 6,
	fov: 58,
	mode: "freeOrbital",
	position: [0, 8, 10] as [number, number, number],
	target: [0, 0, 0] as [number, number, number],
	yaw: 0,
	pitch: 0,
	zoom: 1,
} as const;

describe("CameraRig", () => {
	it("forwards the camera control element and snapshot to the camera bridge", () => {
		const cameraControlElement = document.createElement("div");

		render(
			<CameraRig
				cameraControlElement={cameraControlElement}
				cameraSnapshot={TEST_CAMERA_SNAPSHOT}
			/>,
		);

		expect(mockRunestoneCameraControls).toHaveBeenCalledWith(
			expect.objectContaining({
				cameraControlElement,
				cameraSnapshot: TEST_CAMERA_SNAPSHOT,
			}),
		);
	});
});
