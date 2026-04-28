// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DOOR_SIDES, ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import {
	CAMERA_CONFIG,
	CAMERA_DEFAULT_ZOOM,
	PLAYER_EYE_HEIGHT,
} from "@/shared/config";

const frameCallbacks: Array<() => void> = [];
const mockSetCameraMode = vi.fn();
const mockSetCameraAzimuth = vi.fn();
const mockHasPlayerPosition = vi.fn();
const mockGetPlayerPosition = vi.fn();
const mockLastTransition = vi.fn();

const mockCamera = new THREE.PerspectiveCamera();
mockCamera.zoom = CAMERA_DEFAULT_ZOOM;

vi.mock("@react-three/fiber", () => ({
	useFrame: (callback: () => void) => {
		frameCallbacks.push(callback);
	},
	useThree: () => ({ camera: mockCamera }),
}));

vi.mock("@/shared/lib/cameraModeStore", () => ({
	setCameraMode: (...args: unknown[]) => mockSetCameraMode(...args),
}));

vi.mock("@/shared/lib/cameraOrientationStore", () => ({
	setCameraAzimuth: (...args: unknown[]) => mockSetCameraAzimuth(...args),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	hasPlayerPosition: () => mockHasPlayerPosition(),
	getPlayerPosition: () => mockGetPlayerPosition(),
}));

vi.mock("@/features/dungeon-navigation", async (importOriginal) => {
	const original =
		await importOriginal<typeof import("@/features/dungeon-navigation")>();

	return {
		...original,
		useGameMachineSelector: () => mockLastTransition(),
	};
});

const mockIsDesktopLayout = vi.fn();
vi.mock("@/features/responsive-layout", () => ({
	useResponsiveGameLayout: () => ({ isDesktopLayout: mockIsDesktopLayout() }),
}));

import { useCameraRigViewModel } from "./useCameraRigViewModel";

describe("useCameraRigViewModel", () => {
	beforeEach(() => {
		frameCallbacks.length = 0;
		vi.clearAllMocks();
		mockCamera.position.set(0, 0, 0);
		mockCamera.up.set(0, 1, 0);
		mockHasPlayerPosition.mockReturnValue(false);
		mockGetPlayerPosition.mockReturnValue([0, 0, 0]);
		mockLastTransition.mockReturnValue(null);
		mockIsDesktopLayout.mockReturnValue(true);
	});

	it("syncs the camera mode store immediately from the snapshot mode", () => {
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 65,
					mode: CAMERA_MODES.THIRD_PERSON,
					position: [0, 2, -4],
					target: [0, 1, 0],
					zoom: 1,
				},
				playerSpawnPosition: [10, 0.9, -5],
			}),
		);

		expect(result.current.mode).toBe(CAMERA_MODES.THIRD_PERSON);
		expect(
			typeof result.current.orbitBindings.thirdPerson.handleOrbitStart,
		).toBe("function");
		expect(typeof result.current.orbitBindings.thirdPerson.handleOrbitEnd).toBe(
			"function",
		);
		expect(mockSetCameraMode).toHaveBeenCalledWith(CAMERA_MODES.THIRD_PERSON);
	});

	it("reuses shared orbit bindings and threads first-person handlers through the result", () => {
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 65,
					mode: CAMERA_MODES.THIRD_PERSON,
					position: [0, 2, -4],
					target: [0, 1, 0],
					zoom: 1,
				},
				firstPersonLookElement: document.createElement("button"),
				playerSpawnPosition: [10, 0.9, -5],
			}),
		);

		expect(result.current.orbitBindings.freeOrbital).toBe(
			result.current.orbitBindings.thirdPerson,
		);
		expect(result.current.orbitBindings.thirdPerson).toBe(
			result.current.orbitBindings.topDown,
		);
		expect(result.current.firstPersonBindings.handleOrbitStart).toBe(
			result.current.orbitBindings.freeOrbital.handleOrbitStart,
		);
		expect(result.current.firstPersonBindings.handleOrbitEnd).toBe(
			result.current.orbitBindings.freeOrbital.handleOrbitEnd,
		);
	});

	it("centers free-orbital mode on the player spawn on the first frame", () => {
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [0, 16, -18],
					target: [0, 0, 0],
					zoom: 1,
				},
				playerSpawnPosition: [10, 0.9, -5],
			}),
		);
		const freeOrbitalControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};

		result.current.refs.freeOrbitalOrbitRef.current =
			freeOrbitalControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.position.toArray()).toEqual([10, 16.9, -23]);
		expect(freeOrbitalControls.target.toArray()).toEqual([10, 2.15, -5]);
	});

	it("applies free-orbital sync once controls mount after the mode-change frame", () => {
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [0, 16, -18],
					target: [0, 0, 0],
					zoom: 1,
				},
				playerSpawnPosition: [10, 0.9, -5],
			}),
		);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		const freeOrbitalControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};

		result.current.refs.freeOrbitalOrbitRef.current =
			freeOrbitalControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.position.toArray()).toEqual([10, 16.9, -23]);
		expect(freeOrbitalControls.target.toArray()).toEqual([10, 2.15, -5]);
	});

	it("keeps top-down mode strictly overhead while following the player", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([3, 0.9, -7]);

		renderHook(() =>
			useCameraRigViewModel({
				cameraControlElement: null,
				cameraStateSnapshot: {
					fov: 60,
					mode: CAMERA_MODES.TOP_DOWN,
					position: [0, 35, 0],
					target: [0, 0, 0],
					zoom: 1,
				},
				playerSpawnPosition: [10, 0.9, -5],
			}),
		);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.position.toArray()).toEqual([3, 20, -7]);
		expect(mockCamera.up.toArray()).toEqual([0, 0, 1]);
		expect(mockSetCameraAzimuth).toHaveBeenCalledWith(0);
	});

	it("preserves the current orbit while following the player in third-person", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 65,
					mode: CAMERA_MODES.THIRD_PERSON,
					position: [...CAMERA_CONFIG.THIRD_PERSON.OFFSET],
					target: [0, 1, 0],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);
		const thirdPersonControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};

		result.current.refs.thirdPersonOrbitRef.current =
			thirdPersonControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		mockGetPlayerPosition.mockReturnValue([10, 0.9, 0]);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(thirdPersonControls.target.x).toBeGreaterThan(0);
		expect(mockCamera.position.x).toBeGreaterThan(0);
		expect(mockCamera.position.z).toBeCloseTo(
			CAMERA_CONFIG.THIRD_PERSON.OFFSET[2],
			6,
		);
	});

	it("keeps third-person behind north-entry travel while clamped inside the room", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		mockLastTransition.mockReturnValue({
			fromRoom: ROOM_IDS.ENTRANCE,
			toRoom: ROOM_IDS.LIBRARY,
			doorSide: DOOR_SIDES.NORTH,
		});
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 65,
					mode: CAMERA_MODES.THIRD_PERSON,
					position: [...CAMERA_CONFIG.THIRD_PERSON.OFFSET],
					target: [0, 1, 0],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);
		const thirdPersonControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};

		result.current.refs.thirdPersonOrbitRef.current =
			thirdPersonControls as never;
		mockCamera.position.set(6, 5, 6);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		mockGetPlayerPosition.mockReturnValue([10, 0.9, 0]);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.position.x).toBe(10);
		expect(mockCamera.position.y).toBeCloseTo(3.1, 6);
		expect(mockCamera.position.z).toBeCloseTo(-0.6, 6);
		expect(thirdPersonControls.target.toArray()).toEqual([
			10,
			0.9 + PLAYER_EYE_HEIGHT,
			0,
		]);
		expect(thirdPersonControls.update).toHaveBeenCalled();
	});

	it("keeps the camera looking forward from its current position in first-person without pointer lock to prevent strafe panning", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);

		const mockLookAt = vi.spyOn(mockCamera, "lookAt");

		renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 78,
					mode: CAMERA_MODES.FIRST_PERSON,
					position: [0, 1.5, 0],
					target: [0, 0, 0],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);

		// Manually set pointerLockRef to simulate inactive pointer lock
		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: null,
		});

		// Simulate the camera mid-lerp (position hasn't caught up to player)
		mockCamera.position.set(0.1, 1.5, 0);
		mockGetPlayerPosition.mockReturnValue([1, 0.9, 0]);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockLookAt).toHaveBeenCalledWith(
			expect.any(Number), // x
			expect.any(Number), // y
			expect.any(Number), // z
		);

		const lastCallArgs = mockLookAt.mock.lastCall;
		// The lookAt target should be directly in front of the camera's CURRENT position
		expect(lastCallArgs?.[0]).toBeCloseTo(mockCamera.position.x, 2);
		expect(lastCallArgs?.[2]).toBeGreaterThan(mockCamera.position.z);
	});

	it("places the orbit target in camera-space (head + forward*0.01) on sync, then tracks camera forward each frame without calling update()", () => {
		mockIsDesktopLayout.mockReturnValue(false);
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([5, 0.9, 5]);

		// Camera starts looking in +Z (default)
		mockCamera.position.set(5, 2.6, 5);

		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 78,
					mode: CAMERA_MODES.FIRST_PERSON,
					position: [5, 2.6, 5],
					target: [5, 2.6, 6],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);

		const firstPersonOrbitControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};
		result.current.refs.firstPersonOrbitRef.current =
			firstPersonOrbitControls as never;

		// Frame 1: Sync \u2014 camera is at [5,2.6,5], forward is +Z so target = [5,2.6,5.01]
		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.position.toArray()).toEqual([5, 2.6, 5]);
		expect(firstPersonOrbitControls.target.x).toBeCloseTo(5, 5);
		expect(firstPersonOrbitControls.target.y).toBeCloseTo(2.6, 5);
		expect(firstPersonOrbitControls.target.z).toBeCloseTo(5.01, 3);

		// Frame 2: non-sync path — player moves. Camera should snap to the new head position
		// and the target should stay 0.01 ahead in camera-forward.
		// We do NOT expect update() to be called (Drei handles it).
		mockGetPlayerPosition.mockReturnValue([6, 0.9, 5]);

		const callsAfterSync = firstPersonOrbitControls.update.mock.calls.length;
		act(() => {
			frameCallbacks.at(-1)?.();
		});

		// Camera should have followed the player's new head position: [6, 1.7+0.9, 5]
		expect(mockCamera.position.x).toBeCloseTo(6, 5);
		expect(mockCamera.position.y).toBeCloseTo(2.6, 5);
		expect(mockCamera.position.z).toBeCloseTo(5, 5);

		// Target is still camera-forward 0.01 away from the NEW current position
		expect(firstPersonOrbitControls.target.x).toBeCloseTo(6, 5);
		expect(firstPersonOrbitControls.target.y).toBeCloseTo(2.6, 5);
		expect(firstPersonOrbitControls.target.z).toBeCloseTo(5.01, 3);
		// update() must NOT be called again in the non-sync path
		expect(firstPersonOrbitControls.update.mock.calls.length).toBe(
			callsAfterSync,
		);
	});

	it("does not rewrite movement azimuth during free-orbital auto-follow", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [0, 16, -18],
					target: [0, 0, 0],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);
		const freeOrbitalControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};

		result.current.refs.freeOrbitalOrbitRef.current =
			freeOrbitalControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockSetCameraAzimuth).toHaveBeenCalledTimes(1);

		mockGetPlayerPosition.mockReturnValue([10, 0.9, 0]);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockSetCameraAzimuth).toHaveBeenCalledTimes(1);
	});

	it("updates movement azimuth while the user is actively orbiting in free-orbital", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [0, 16, -18],
					target: [0, 0, 0],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);
		const freeOrbitalControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};

		result.current.refs.freeOrbitalOrbitRef.current =
			freeOrbitalControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockSetCameraAzimuth).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.orbitBindings.freeOrbital.handleOrbitStart();
			frameCallbacks.at(-1)?.();
		});

		expect(mockSetCameraAzimuth).toHaveBeenCalledTimes(2);
	});

	it("snaps preserved orbit immediately on large free-orbital target jumps", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [0, 16, -18],
					target: [0, 0, 0],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);
		const freeOrbitalControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};

		result.current.refs.freeOrbitalOrbitRef.current =
			freeOrbitalControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		mockGetPlayerPosition.mockReturnValue([10, 0.9, 0]);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.position.toArray()).toEqual([10, 16.9, -18]);
		expect(freeOrbitalControls.target.toArray()).toEqual([10, 2.15, 0]);
	});

	it("keeps the free-orbital camera stable during ordinary movement", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [0, 16, -18],
					target: [0, 0, 0],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);
		const freeOrbitalControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};

		result.current.refs.freeOrbitalOrbitRef.current =
			freeOrbitalControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		mockGetPlayerPosition.mockReturnValue([2, 0.9, 0]);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockCamera.position.toArray()).toEqual([0, 16.9, -18]);
		expect(freeOrbitalControls.target.toArray()).toEqual([0, 2.15, 0]);
		expect(freeOrbitalControls.update).toHaveBeenCalledTimes(1);
	});

	it("pauses third-person follow lerping when the user is manually orbiting", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 65,
					mode: CAMERA_MODES.THIRD_PERSON,
					position: [0, 2, -4],
					target: [0, 1, 0],
					zoom: 1,
				},
				playerSpawnPosition: [0, 0.9, 0],
			}),
		);
		const thirdPersonControls = {
			target: new THREE.Vector3(),
			update: vi.fn(),
		};
		result.current.refs.thirdPersonOrbitRef.current =
			thirdPersonControls as never;

		// Initial frame to clear sync
		act(() => {
			frameCallbacks.at(-1)?.();
		});

		// User starts orbiting
		act(() => {
			result.current.orbitBindings.freeOrbital.handleOrbitStart();
		});

		const initialCameraPosition = mockCamera.position.clone();
		mockGetPlayerPosition.mockReturnValue([2, 0.9, 0]); // Move player slightly

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		// Camera should NOT have moved linearly via the follow lerp
		expect(mockCamera.position.toArray()).toEqual(
			initialCameraPosition.toArray(),
		);
	});
});
