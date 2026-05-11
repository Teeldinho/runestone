// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";

import { CameraRig } from "./CameraRig";

const mockOrbitControls = vi.fn((_props: unknown) => (
	<div data-testid="orbit-controls" />
));
const mockUseCameraRigViewModel = vi.fn();

vi.mock("@react-three/drei", () => ({
	OrbitControls: (props: unknown) => mockOrbitControls(props),
	PointerLockControls: () => <div data-testid="pointer-lock-controls" />,
	useAnimations: () => ({ actions: {} }),
	useGLTF: Object.assign(() => ({ animations: [], scene: null }), {
		preload: vi.fn(),
	}),
}));

vi.mock("../model", () => ({
	useCameraRigViewModel: (input: unknown) => mockUseCameraRigViewModel(input),
}));

const createCameraRigViewModel = (mode: string | undefined) => ({
	firstPersonBindings: {
		firstPersonLookElement: null,
		handleFirstPersonLock: vi.fn(),
		handleFirstPersonUnlock: vi.fn(),
		handleOrbitEnd: vi.fn(),
		handleOrbitStart: vi.fn(),
	},
	orbitBindings: {
		freeOrbital: {
			cameraControlElement: null,
			handleOrbitEnd: vi.fn(),
			handleOrbitStart: vi.fn(),
		},
		thirdPerson: {
			cameraControlElement: null,
			handleOrbitEnd: vi.fn(),
			handleOrbitStart: vi.fn(),
		},
		topDown: {
			cameraControlElement: null,
			handleOrbitEnd: vi.fn(),
			handleOrbitStart: vi.fn(),
		},
	},
	mode,
	refs: {
		firstPersonOrbitRef: { current: null },
		freeOrbitalOrbitRef: { current: null },
		pointerLockRef: { current: null },
		thirdPersonOrbitRef: { current: null },
		topDownOrbitRef: { current: null },
	},
	isDesktopLayout: true,
});

const TEST_CAMERA_STATE_SNAPSHOT = {
	fov: 58,
	mode: CAMERA_MODES.FREE_ORBITAL,
	position: [0, 8, 10] as [number, number, number],
	target: [0, 0, 0] as [number, number, number],
	zoom: 1,
	yaw: 0,
	pitch: 0,
	distance: 6,
} as const;

describe("CameraRig", () => {
	beforeEach(() => {
		mockOrbitControls.mockClear();
		mockUseCameraRigViewModel.mockReset();
	});

	it("uses orbit touch gestures for free-orbital mode", () => {
		mockUseCameraRigViewModel.mockReturnValue(
			createCameraRigViewModel(CAMERA_MODES.FREE_ORBITAL),
		);

		render(
			<CameraRig
				cameraStateSnapshot={TEST_CAMERA_STATE_SNAPSHOT}
				playerSpawnPosition={[0, 0, 0]}
			/>,
		);

		expect(mockOrbitControls).toHaveBeenCalledWith(
			expect.objectContaining({
				touches: CAMERA_RIG_TOUCH_GESTURES.ORBIT,
			}),
		);
	});

	it("uses top-down touch gestures for top-down mode", () => {
		mockUseCameraRigViewModel.mockReturnValue(
			createCameraRigViewModel(CAMERA_MODES.TOP_DOWN),
		);

		render(
			<CameraRig
				cameraStateSnapshot={{
					...TEST_CAMERA_STATE_SNAPSHOT,
					mode: CAMERA_MODES.TOP_DOWN,
				}}
				playerSpawnPosition={[0, 0, 0]}
			/>,
		);

		expect(mockOrbitControls).toHaveBeenCalledWith(
			expect.objectContaining({
				touches: CAMERA_RIG_TOUCH_GESTURES.TOP_DOWN,
			}),
		);
	});
});
