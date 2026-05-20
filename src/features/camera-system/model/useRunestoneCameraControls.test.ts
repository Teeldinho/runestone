// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type CameraControlsImpl from "camera-controls";
import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	CAMERA_CONFIG,
	GAME_FRAME_PRIORITIES,
	PLAYER_EYE_HEIGHT,
} from "@/shared/config";
import {
	CAMERA_CONTROLS_TOP_DOWN_AZIMUTH,
	CAMERA_MODES,
	type CameraMode,
} from "../config";
import {
	type CameraRuntimeSnapshot,
	useRunestoneCameraControls,
} from "./useRunestoneCameraControls";

const frameCallbacks: Array<(delta?: number) => void> = [];
const framePriorities: Array<number | undefined> = [];
const mockGetPlayerPosition = vi.fn();
const mockGetPlayerCameraFollowPosition = vi.fn();
const mockGetPlayerCameraFollowPositionSnapshot = vi.fn();
const mockHasPlayerCameraFollowPosition = vi.fn();
const mockIsDesktopLayout = vi.fn();
const mockSetCameraAzimuth = vi.fn();

const mockCamera = new THREE.PerspectiveCamera();
mockCamera.fov = 60;

vi.mock("@react-three/fiber", () => ({
	useFrame: (callback: (delta?: number) => void, priority?: number) => {
		frameCallbacks.push(callback);
		framePriorities.push(priority);
	},
	useThree: () => ({
		camera: mockCamera,
		gl: {
			domElement: document.createElement("canvas"),
		},
	}),
}));

vi.mock("@/shared/lib", async (importOriginal) => {
	const original = await importOriginal<typeof import("@/shared/lib")>();

	return {
		...original,
		getPlayerPosition: () => mockGetPlayerPosition(),
		getPlayerCameraFollowPosition: () => mockGetPlayerCameraFollowPosition(),
		getPlayerCameraFollowPositionSnapshot: () =>
			mockGetPlayerCameraFollowPositionSnapshot(),
		hasPlayerCameraFollowPosition: () => mockHasPlayerCameraFollowPosition(),
		setCameraAzimuth: (...args: unknown[]) => mockSetCameraAzimuth(...args),
		useResponsiveLayout: () => ({
			isDesktopLayout: mockIsDesktopLayout(),
		}),
	};
});

type MockCameraControls = {
	azimuthAngle: number;
	polarAngle: number;
	moveTo: ReturnType<typeof vi.fn>;
	normalizeRotations: ReturnType<typeof vi.fn>;
	rotateTo: ReturnType<typeof vi.fn>;
	setLookAt: ReturnType<typeof vi.fn>;
};

const createCameraSnapshot = (
	mode: CameraMode,
	fov: number,
	position: CameraRuntimeSnapshot["position"],
	target: CameraRuntimeSnapshot["target"],
): CameraRuntimeSnapshot => ({
	distance: 6,
	fov,
	mode,
	pitch: 0,
	position,
	target,
	yaw: 0,
	zoom: 1,
});

describe("useRunestoneCameraControls", () => {
	const createControls = (
		azimuthAngle = 0.75,
		polarAngle = 0.85,
	): MockCameraControls => {
		const controls = {
			azimuthAngle,
			polarAngle,
			moveTo: vi.fn(),
			normalizeRotations: vi.fn(),
			rotateTo: vi.fn(),
			setLookAt: vi.fn(),
		} as MockCameraControls;

		controls.normalizeRotations.mockReturnValue(controls);
		controls.rotateTo.mockReturnValue(controls);
		controls.setLookAt.mockReturnValue(controls);

		return controls;
	};

	beforeEach(() => {
		frameCallbacks.length = 0;
		framePriorities.length = 0;
		vi.clearAllMocks();
		mockCamera.fov = 60;
		mockCamera.up.set(0, 1, 0);
		mockGetPlayerPosition.mockReturnValue([0, 0, 0]);
		mockGetPlayerCameraFollowPosition.mockReturnValue([0, 0, 0]);
		mockGetPlayerCameraFollowPositionSnapshot.mockReturnValue([0, 0, 0]);
		mockHasPlayerCameraFollowPosition.mockReturnValue(false);
		mockIsDesktopLayout.mockReturnValue(true);
	});

	it("uses the destination preset on initial mount", () => {
		const { result } = renderHook(() =>
			useRunestoneCameraControls({
				cameraSnapshot: createCameraSnapshot(
					CAMERA_MODES.THIRD_PERSON,
					CAMERA_CONFIG.THIRD_PERSON.FOV,
					CAMERA_CONFIG.THIRD_PERSON.OFFSET,
					[0, PLAYER_EYE_HEIGHT, 0],
				),
			}),
		);

		expect(framePriorities.at(-1)).toBe(
			GAME_FRAME_PRIORITIES.CAMERA_FOLLOW_SYNC,
		);

		const controls = createControls(0.45);
		result.current.controlsRef.current =
			controls as unknown as CameraControlsImpl;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(controls.normalizeRotations).toHaveBeenCalledTimes(1);
		expect(controls.setLookAt).toHaveBeenCalledWith(
			CAMERA_CONFIG.THIRD_PERSON.OFFSET[0],
			CAMERA_CONFIG.THIRD_PERSON.OFFSET[1],
			CAMERA_CONFIG.THIRD_PERSON.OFFSET[2],
			0,
			PLAYER_EYE_HEIGHT,
			0,
			false,
		);
		expect(controls.rotateTo).not.toHaveBeenCalled();
		expect(controls.moveTo).not.toHaveBeenCalled();
		expect(mockSetCameraAzimuth).toHaveBeenCalledWith(0.45 + Math.PI);
	});

	it("preserves the last world-facing heading when switching between non-top-down modes", () => {
		type RenderHookProps = {
			cameraSnapshot: CameraRuntimeSnapshot;
		};

		const { result, rerender } = renderHook<
			ReturnType<typeof useRunestoneCameraControls>,
			RenderHookProps
		>(
			({ cameraSnapshot }: RenderHookProps) =>
				useRunestoneCameraControls({
					cameraSnapshot,
				}),
			{
				initialProps: {
					cameraSnapshot: createCameraSnapshot(
						CAMERA_MODES.THIRD_PERSON,
						CAMERA_CONFIG.THIRD_PERSON.FOV,
						CAMERA_CONFIG.THIRD_PERSON.OFFSET,
						[0, PLAYER_EYE_HEIGHT, 0],
					),
				},
			},
		);

		const controls = createControls(0.45, 0.82);
		result.current.controlsRef.current =
			controls as unknown as CameraControlsImpl;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		rerender({
			cameraSnapshot: createCameraSnapshot(
				CAMERA_MODES.FREE_ORBITAL,
				CAMERA_CONFIG.FREE_ORBITAL.FOV,
				CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION,
				[0, 0, 0],
			),
		});

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(controls.rotateTo).toHaveBeenCalledWith(
			expect.closeTo(0.45, 6),
			0.82,
			false,
		);
	});

	it("keeps the last non-top-down look memory when entering and leaving top-down", () => {
		type RenderHookProps = {
			cameraSnapshot: CameraRuntimeSnapshot;
		};

		const { result, rerender } = renderHook<
			ReturnType<typeof useRunestoneCameraControls>,
			RenderHookProps
		>(
			({ cameraSnapshot }: RenderHookProps) =>
				useRunestoneCameraControls({
					cameraSnapshot,
				}),
			{
				initialProps: {
					cameraSnapshot: createCameraSnapshot(
						CAMERA_MODES.THIRD_PERSON,
						CAMERA_CONFIG.THIRD_PERSON.FOV,
						CAMERA_CONFIG.THIRD_PERSON.OFFSET,
						[0, PLAYER_EYE_HEIGHT, 0],
					),
				},
			},
		);

		const controls = createControls(0.35, 0.76);
		result.current.controlsRef.current =
			controls as unknown as CameraControlsImpl;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		rerender({
			cameraSnapshot: createCameraSnapshot(
				CAMERA_MODES.TOP_DOWN,
				CAMERA_CONFIG.TOP_DOWN.FOV,
				[0, CAMERA_CONFIG.TOP_DOWN.HEIGHT, 0],
				[0, 0, 0],
			),
		});

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(controls.rotateTo).toHaveBeenLastCalledWith(
			CAMERA_CONTROLS_TOP_DOWN_AZIMUTH,
			CAMERA_CONFIG.TOP_DOWN.POLAR_ANGLE,
			false,
		);

		controls.azimuthAngle = 2.1;
		controls.polarAngle = CAMERA_CONFIG.TOP_DOWN.POLAR_ANGLE;

		rerender({
			cameraSnapshot: createCameraSnapshot(
				CAMERA_MODES.THIRD_PERSON,
				CAMERA_CONFIG.THIRD_PERSON.FOV,
				CAMERA_CONFIG.THIRD_PERSON.OFFSET,
				[0, PLAYER_EYE_HEIGHT, 0],
			),
		});

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(controls.rotateTo).toHaveBeenLastCalledWith(
			expect.closeTo(0.35, 6),
			0.76,
			false,
		);
	});

	it("moves the follow target without reapplying look-at while the mode stays stable", () => {
		const { result } = renderHook(() =>
			useRunestoneCameraControls({
				cameraSnapshot: createCameraSnapshot(
					CAMERA_MODES.THIRD_PERSON,
					CAMERA_CONFIG.THIRD_PERSON.FOV,
					CAMERA_CONFIG.THIRD_PERSON.OFFSET,
					[0, PLAYER_EYE_HEIGHT, 0],
				),
			}),
		);

		const controls = createControls(0.45);
		result.current.controlsRef.current =
			controls as unknown as CameraControlsImpl;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		mockHasPlayerCameraFollowPosition.mockReturnValue(true);
		mockGetPlayerCameraFollowPosition.mockReturnValue([4, 0, -2]);
		mockGetPlayerCameraFollowPositionSnapshot.mockReturnValue([4, 0, -2]);

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(controls.setLookAt).toHaveBeenCalledTimes(1);
		expect(controls.moveTo).toHaveBeenCalledWith(
			4,
			PLAYER_EYE_HEIGHT,
			-2,
			false,
		);
		expect(mockSetCameraAzimuth).toHaveBeenCalledTimes(2);
	});

	it("updates FOV and remounts when the up-axis regime changes", () => {
		type RenderHookProps = {
			fov: number;
			mode: CameraMode;
		};

		const { result, rerender } = renderHook<
			ReturnType<typeof useRunestoneCameraControls>,
			RenderHookProps
		>(
			({ mode, fov }: RenderHookProps) =>
				useRunestoneCameraControls({
					cameraSnapshot: createCameraSnapshot(
						mode,
						fov,
						CAMERA_CONFIG.THIRD_PERSON.OFFSET,
						[0, PLAYER_EYE_HEIGHT, 0],
					),
				}),
			{
				initialProps: {
					fov: CAMERA_CONFIG.THIRD_PERSON.FOV,
					mode: CAMERA_MODES.THIRD_PERSON,
				},
			},
		);

		expect(result.current.controlsKey).toBe(0);
		expect(mockCamera.up.toArray()).toEqual([0, 1, 0]);

		rerender({
			fov: CAMERA_CONFIG.FIRST_PERSON.FOV,
			mode: CAMERA_MODES.TOP_DOWN,
		});

		expect(result.current.controlsKey).toBe(1);
		expect(mockCamera.up.toArray()).toEqual([0, 0, 1]);
		expect(mockCamera.fov).toBe(CAMERA_CONFIG.FIRST_PERSON.FOV);
	});

	it("locks top-down movement azimuth", () => {
		const { result } = renderHook(() =>
			useRunestoneCameraControls({
				cameraSnapshot: createCameraSnapshot(
					CAMERA_MODES.TOP_DOWN,
					CAMERA_CONFIG.TOP_DOWN.FOV,
					[0, CAMERA_CONFIG.TOP_DOWN.HEIGHT, 0],
					[0, 0, 0],
				),
			}),
		);

		const controls = createControls(1.1);
		result.current.controlsRef.current =
			controls as unknown as CameraControlsImpl;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(mockSetCameraAzimuth).toHaveBeenCalledWith(0);
	});
});
