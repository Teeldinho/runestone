// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockRunestoneOrbitControls = vi.fn((_props: unknown) => (
	<div data-testid="runestone-orbit-controls" />
));

vi.mock("@/features/camera-system", () => ({
	RunestoneOrbitControls: (props: unknown) => mockRunestoneOrbitControls(props),
}));

import { CameraRig } from "./CameraRig";

const TEST_CAMERA_SNAPSHOT = {
	fov: 58,
	mode: "freeOrbital",
	position: [0, 8, 10] as [number, number, number],
	target: [0, 0, 0] as [number, number, number],
	zoom: 1,
	yaw: 0,
	pitch: 0,
	distance: 6,
} as const;

describe("CameraRig", () => {
	it("forwards the canonical camera snapshot and look surface to the shared OrbitControls bridge", () => {
		const cameraActorRef = { send: vi.fn() };
		const cameraControlElement = document.createElement("div");

		render(
			<CameraRig
				cameraActorRef={cameraActorRef as never}
				cameraControlElement={cameraControlElement}
				cameraSnapshot={TEST_CAMERA_SNAPSHOT}
			/>,
		);

		expect(mockRunestoneOrbitControls).toHaveBeenCalledWith(
			expect.objectContaining({
				cameraActorRef,
				cameraControlElement,
				cameraSnapshot: TEST_CAMERA_SNAPSHOT,
			}),
		);
	});
});
