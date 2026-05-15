// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CameraRigFirstPersonControls } from "./CameraRigFirstPersonControls";

const mockPointerLockControls = vi.fn((_props: unknown) => (
	<div data-testid="pointer-lock-controls" />
));

vi.mock("@react-three/drei", () => ({
	PointerLockControls: (props: unknown) => mockPointerLockControls(props),
	useAnimations: () => ({ actions: {} }),
	useGLTF: Object.assign(() => ({ animations: [], scene: null }), {
		preload: vi.fn(),
	}),
}));

describe("CameraRigFirstPersonControls", () => {
	it("renders nothing on mobile", () => {
		const firstPersonBindings = {
			firstPersonLookElement: document.createElement("div"),
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

		const { container } = render(
			<CameraRigFirstPersonControls
				firstPersonBindings={firstPersonBindings}
				refs={refs}
				isDesktopLayout={false}
			/>,
		);

		expect(container.innerHTML).toBe("");
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
