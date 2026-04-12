// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DOOR_SIDES, ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { CAMERA_DEFAULT_ZOOM, PLAYER_EYE_HEIGHT } from "@/shared/config";

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
		selectLastTransition: "selectLastTransition",
		useGameMachineSelector: () => mockLastTransition(),
	};
});

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
	});

	it("syncs the camera mode store immediately from the snapshot mode", () => {
		renderHook(() =>
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

		expect(mockSetCameraMode).toHaveBeenCalledWith(CAMERA_MODES.THIRD_PERSON);
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

		result.current.freeOrbitalOrbitRef.current = freeOrbitalControls as never;

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

		result.current.freeOrbitalOrbitRef.current = freeOrbitalControls as never;

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
	});

	it("preserves the current orbit while following the player in third-person", () => {
		mockHasPlayerPosition.mockReturnValue(true);
		mockGetPlayerPosition.mockReturnValue([0, 0.9, 0]);
		const { result } = renderHook(() =>
			useCameraRigViewModel({
				cameraStateSnapshot: {
					fov: 65,
					mode: CAMERA_MODES.THIRD_PERSON,
					position: [0, 2.2, -3.8],
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

		result.current.thirdPersonOrbitRef.current = thirdPersonControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		mockGetPlayerPosition.mockReturnValue([10, 0.9, 0]);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(thirdPersonControls.target.x).toBeGreaterThan(0);
		expect(mockCamera.position.x).toBeGreaterThan(0);
		expect(mockCamera.position.z).toBeCloseTo(-3.8, 6);
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
					position: [0, 2.2, -3.8],
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

		result.current.thirdPersonOrbitRef.current = thirdPersonControls as never;
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

		result.current.freeOrbitalOrbitRef.current = freeOrbitalControls as never;

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

		result.current.freeOrbitalOrbitRef.current = freeOrbitalControls as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockSetCameraAzimuth).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.handleOrbitStart();
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

		result.current.freeOrbitalOrbitRef.current = freeOrbitalControls as never;

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

		result.current.freeOrbitalOrbitRef.current = freeOrbitalControls as never;

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
});
