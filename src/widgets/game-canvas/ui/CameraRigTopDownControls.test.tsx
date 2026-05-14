// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";

import { CameraRigTopDownControls } from "./CameraRigTopDownControls";

const mockOrbitControls = vi.fn((_props: unknown) => (
	<div data-testid="orbit-controls" />
));

vi.mock("@react-three/drei", () => ({
	OrbitControls: (props: unknown) => mockOrbitControls(props),
	useAnimations: () => ({ actions: {} }),
	useGLTF: Object.assign(() => ({ animations: [], scene: null }), {
		preload: vi.fn(),
	}),
}));

describe("CameraRigTopDownControls", () => {
	it("locks the top-down orbit to the shared polar and azimuth angles", () => {
		const cameraControlElement = document.createElement("div");
		const orbitBindings = {
			domElement: cameraControlElement,
			handleOrbitEnd: vi.fn(),
			handleOrbitStart: vi.fn(),
			shouldRenderOrbitControls: true,
		};
		const refs = {
			firstPersonOrbitRef: { current: null },
			freeOrbitalOrbitRef: { current: null },
			pointerLockRef: { current: null },
			thirdPersonOrbitRef: { current: null },
			topDownOrbitRef: { current: null },
		};

		render(
			<CameraRigTopDownControls orbitBindings={orbitBindings} refs={refs} />,
		);

		expect(mockOrbitControls).toHaveBeenCalledWith(
			expect.objectContaining({
				domElement: cameraControlElement,
				enableRotate: false,
				enableZoom: true,
				maxAzimuthAngle: CAMERA_CONFIG.TOP_DOWN.LOCKED_AZIMUTH_ANGLE,
				maxPolarAngle: CAMERA_CONFIG.TOP_DOWN.POLAR_ANGLE,
				minAzimuthAngle: CAMERA_CONFIG.TOP_DOWN.LOCKED_AZIMUTH_ANGLE,
				minDistance: CAMERA_CONFIG.TOP_DOWN.MIN_DISTANCE,
				minPolarAngle: CAMERA_CONFIG.TOP_DOWN.POLAR_ANGLE,
				onEnd: orbitBindings.handleOrbitEnd,
				onStart: orbitBindings.handleOrbitStart,
				touches: CAMERA_RIG_TOUCH_GESTURES.TOP_DOWN,
			}),
		);
	});

	it("renders null when orbit controls are not ready", () => {
		const orbitBindings = {
			domElement: undefined,
			handleOrbitEnd: vi.fn(),
			handleOrbitStart: vi.fn(),
			shouldRenderOrbitControls: false,
		};
		const refs = {
			firstPersonOrbitRef: { current: null },
			freeOrbitalOrbitRef: { current: null },
			pointerLockRef: { current: null },
			thirdPersonOrbitRef: { current: null },
			topDownOrbitRef: { current: null },
		};

		const { container } = render(
			<CameraRigTopDownControls orbitBindings={orbitBindings} refs={refs} />,
		);

		expect(container.firstChild).toBeNull();
	});
});
