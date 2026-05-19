// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

const mockCameraControls = vi.fn(({ children }: { children?: ReactNode }) => (
	<div data-testid="camera-controls">{children}</div>
));
const mockUseRunestoneCameraControls = vi.fn();

vi.mock("@react-three/drei", () => ({
	CameraControls: (props: unknown) => mockCameraControls(props as never),
}));

vi.mock("../model/useRunestoneCameraControls", () => ({
	useRunestoneCameraControls: (props: unknown) =>
		mockUseRunestoneCameraControls(props),
}));

import { RunestoneCameraControls } from "./RunestoneCameraControls";

const TEST_CAMERA_SNAPSHOT = {
	distance: 6,
	fov: 58,
	mode: "thirdPerson",
	position: [0, 8, 10] as [number, number, number],
	target: [0, 0, 0] as [number, number, number],
	yaw: 0,
	pitch: 0,
	zoom: 1,
} as const;

describe("RunestoneCameraControls", () => {
	it("enables regress support on the camera controls bridge", () => {
		const cameraControlElement = document.createElement("div");

		mockUseRunestoneCameraControls.mockReturnValue({
			azimuthRotateSpeed: 1,
			controlsKey: 3,
			controlsRef: { current: null },
			dollySpeed: 1,
			domElement: cameraControlElement,
			draggingSmoothTime: 0.25,
			maxDistance: 12,
			maxPolarAngle: 1.5,
			minDistance: 4,
			minPolarAngle: 0.25,
			mouseButtons: {},
			shouldRender: true,
			smoothTime: 0.2,
			touches: {},
			truckSpeed: 1,
			polarRotateSpeed: 1,
		});

		render(
			<RunestoneCameraControls
				cameraControlElement={cameraControlElement}
				cameraSnapshot={TEST_CAMERA_SNAPSHOT}
			/>,
		);

		expect(mockUseRunestoneCameraControls).toHaveBeenCalledWith({
			cameraControlElement,
			cameraSnapshot: TEST_CAMERA_SNAPSHOT,
		});
		expect(mockCameraControls).toHaveBeenCalledWith(
			expect.objectContaining({
				regress: true,
				makeDefault: true,
				domElement: cameraControlElement,
			}),
		);
	});
});
