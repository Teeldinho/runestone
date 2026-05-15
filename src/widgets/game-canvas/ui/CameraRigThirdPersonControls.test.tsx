// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CameraRigThirdPersonControls } from "./CameraRigThirdPersonControls";

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

const createRefs = () => ({
	firstPersonOrbitRef: { current: null },
	freeOrbitalOrbitRef: { current: null },
	pointerLockRef: { current: null },
	thirdPersonOrbitRef: { current: null },
	topDownOrbitRef: { current: null },
});

describe("CameraRigThirdPersonControls", () => {
	it("renders null when orbit controls are not ready", () => {
		const { container } = render(
			<CameraRigThirdPersonControls
				orbitBindings={{
					domElement: undefined,
					handleOrbitEnd: vi.fn(),
					handleOrbitStart: vi.fn(),
					shouldRenderOrbitControls: false,
				}}
				refs={createRefs()}
			/>,
		);

		expect(container.firstChild).toBeNull();
		expect(mockOrbitControls).not.toHaveBeenCalled();
	});

	it("passes the dedicated DOM element when available", () => {
		const domElement = document.createElement("div");

		render(
			<CameraRigThirdPersonControls
				orbitBindings={{
					domElement,
					handleOrbitEnd: vi.fn(),
					handleOrbitStart: vi.fn(),
					shouldRenderOrbitControls: true,
				}}
				refs={createRefs()}
			/>,
		);

		expect(mockOrbitControls).toHaveBeenCalledWith(
			expect.objectContaining({ domElement }),
		);
	});
});
