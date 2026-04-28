// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_RIG_FIRST_PERSON_FIXED_ORBIT_DISTANCE } from "../config";

import { CameraRigFirstPersonControls } from "./CameraRigFirstPersonControls";

const mockOrbitControls = vi.fn((_props: unknown) => (
	<div data-testid="orbit-controls" />
));
const mockPointerLockControls = vi.fn((_props: unknown) => (
	<div data-testid="pointer-lock-controls" />
));

vi.mock("@react-three/drei", () => ({
	OrbitControls: (props: unknown) => mockOrbitControls(props),
	PointerLockControls: (props: unknown) => mockPointerLockControls(props),
	useAnimations: () => ({ actions: {} }),
	useGLTF: Object.assign(() => ({ animations: [], scene: null }), {
		preload: vi.fn(),
	}),
}));

describe("CameraRigFirstPersonControls", () => {
	it("uses the fixed orbit distance on mobile first-person orbit lock", () => {
		const firstPersonLookElement = document.createElement("div");
		const firstPersonBindings = {
			firstPersonLookElement,
			handleFirstPersonLock: vi.fn(),
			handleFirstPersonUnlock: vi.fn(),
			handleOrbitEnd: vi.fn(),
			handleOrbitStart: vi.fn(),
		};
		const refs = {
			firstPersonOrbitRef: { current: null },
			freeOrbitalOrbitRef: { current: null },
			pointerLockRef: { current: null },
			thirdPersonOrbitRef: { current: null },
			topDownOrbitRef: { current: null },
		};

		render(
			<CameraRigFirstPersonControls
				firstPersonBindings={firstPersonBindings}
				refs={refs}
				isDesktopLayout={false}
			/>,
		);

		expect(mockOrbitControls).toHaveBeenCalledWith(
			expect.objectContaining({
				domElement: firstPersonLookElement,
				enablePan: false,
				enableRotate: true,
				enableZoom: false,
				maxDistance: CAMERA_RIG_FIRST_PERSON_FIXED_ORBIT_DISTANCE,
				minDistance: CAMERA_RIG_FIRST_PERSON_FIXED_ORBIT_DISTANCE,
				onEnd: firstPersonBindings.handleOrbitEnd,
				onStart: firstPersonBindings.handleOrbitStart,
			}),
		);
	});

	it("renders pointer lock controls on desktop", () => {
		const firstPersonBindings = {
			firstPersonLookElement: null,
			handleFirstPersonLock: vi.fn(),
			handleFirstPersonUnlock: vi.fn(),
			handleOrbitEnd: vi.fn(),
			handleOrbitStart: vi.fn(),
		};
		const refs = {
			firstPersonOrbitRef: { current: null },
			freeOrbitalOrbitRef: { current: null },
			pointerLockRef: { current: null },
			thirdPersonOrbitRef: { current: null },
			topDownOrbitRef: { current: null },
		};

		render(
			<CameraRigFirstPersonControls
				firstPersonBindings={firstPersonBindings}
				refs={refs}
				isDesktopLayout
			/>,
		);

		expect(mockPointerLockControls).toHaveBeenCalledWith(
			expect.objectContaining({
				onLock: firstPersonBindings.handleFirstPersonLock,
				onUnlock: firstPersonBindings.handleFirstPersonUnlock,
				selector: "#game-canvas-fp-lock",
			}),
		);
	});
});
