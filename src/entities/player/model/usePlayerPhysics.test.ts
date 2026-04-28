// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/shared/config";

const frameCallbacks: Array<(...args: unknown[]) => void> = [];
const mockGetCameraMode = vi.fn();
const mockGetCameraAzimuth = vi.fn();
const mockConsumePlayerTeleportTarget = vi.fn();
const mockSetPlayerPosition = vi.fn();
const mockResolvePlayerPhysicsTeleportTranslation = vi.fn();
const mockResolvePlayerPhysicsLinearVelocity = vi.fn();
const mockCreateSmoothedPlayerPhysicsRotation = vi.fn();

vi.mock("@react-three/fiber", () => ({
	useFrame: (callback: (...args: unknown[]) => void) => {
		frameCallbacks.push(callback);
	},
}));

vi.mock("@/shared/lib/cameraModeStore", () => ({
	getCameraMode: () => mockGetCameraMode(),
}));

vi.mock("@/shared/lib/cameraOrientationStore", () => ({
	getCameraAzimuth: () => mockGetCameraAzimuth(),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	consumePlayerTeleportTarget: () => mockConsumePlayerTeleportTarget(),
	setPlayerPosition: (...args: unknown[]) => mockSetPlayerPosition(...args),
}));

vi.mock("../lib/playerPhysics", () => ({
	createSmoothedPlayerPhysicsRotation: (...args: unknown[]) =>
		mockCreateSmoothedPlayerPhysicsRotation(...args),
	resolvePlayerPhysicsLinearVelocity: (...args: unknown[]) =>
		mockResolvePlayerPhysicsLinearVelocity(...args),
	resolvePlayerPhysicsTeleportTranslation: (...args: unknown[]) =>
		mockResolvePlayerPhysicsTeleportTranslation(...args),
}));

import { PLAYER_ENTITY_CONFIG } from "../config";

import { usePlayerPhysics } from "./usePlayerPhysics";

type FakeBody = {
	translation: () => { x: number; y: number; z: number };
	linvel: () => { x: number; y: number; z: number };
	rotation: () => { x: number; y: number; z: number; w: number };
	setLinvel: ReturnType<typeof vi.fn>;
	setRotation: ReturnType<typeof vi.fn>;
	setTranslation: ReturnType<typeof vi.fn>;
};

const createFakeBody = (): FakeBody => {
	let currentLinvel = { x: 0, y: 0, z: 0 };
	const currentRotation = { x: 0, y: 0, z: 0, w: 1 };

	return {
		translation: () => ({ x: 2, y: 1, z: -3 }),
		linvel: () => currentLinvel,
		rotation: () => currentRotation,
		setLinvel: vi.fn((next: { x: number; y: number; z: number }) => {
			currentLinvel = next;
		}),
		setRotation: vi.fn(),
		setTranslation: vi.fn(),
	};
};

describe("usePlayerPhysics", () => {
	beforeEach(() => {
		frameCallbacks.length = 0;
		vi.clearAllMocks();
		mockGetCameraMode.mockReturnValue(CAMERA_MODES.FREE_ORBITAL);
		mockGetCameraAzimuth.mockReturnValue(Math.PI / 2);
		mockConsumePlayerTeleportTarget.mockReturnValue(null);
		mockResolvePlayerPhysicsTeleportTranslation.mockImplementation(
			(teleportTarget: [number, number, number]) => ({
				x: teleportTarget[0],
				y: teleportTarget[1],
				z: teleportTarget[2],
			}),
		);
		mockResolvePlayerPhysicsLinearVelocity.mockReturnValue({
			horizontalVelocity: [PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED, 0, 0],
			isMoving: true,
			rotationTarget: new THREE.Quaternion(),
		});
		mockCreateSmoothedPlayerPhysicsRotation.mockImplementation(
			({ currentRotation, rotationTarget }) =>
				new THREE.Quaternion(
					currentRotation.x,
					currentRotation.y,
					currentRotation.z,
					currentRotation.w,
				).slerp(rotationTarget, 1),
		);
	});

	it("consumes teleport targets and forwards camera-relative movement through helpers", () => {
		mockResolvePlayerPhysicsLinearVelocity.mockReturnValue({
			horizontalVelocity: [PLAYER_ENTITY_CONFIG.MOVEMENT.SPRINT_SPEED, 0, 0],
			isMoving: true,
			rotationTarget: new THREE.Quaternion().setFromAxisAngle(
				new THREE.Vector3(0, 1, 0),
				Math.PI / 4,
			),
		});
		const smoothedRotation = new THREE.Quaternion().setFromAxisAngle(
			new THREE.Vector3(0, 1, 0),
			Math.PI / 2,
		);
		mockCreateSmoothedPlayerPhysicsRotation.mockReturnValue(smoothedRotation);

		const { result } = renderHook(() =>
			usePlayerPhysics({ velocity: [0, 0, -1], isSprinting: true }),
		);
		const body = createFakeBody();

		result.current.rigidBodyRef.current = body as never;

		act(() => {
			mockConsumePlayerTeleportTarget.mockReturnValue([2, 1, -3]);
			frameCallbacks.at(-1)?.({}, 0.016);
		});

		expect(mockResolvePlayerPhysicsTeleportTranslation).toHaveBeenCalledWith([
			2, 1, -3,
		]);
		expect(body.setTranslation).toHaveBeenCalledWith(
			{ x: 2, y: 1, z: -3 },
			true,
		);
		expect(mockResolvePlayerPhysicsLinearVelocity).toHaveBeenCalledWith({
			cameraAzimuth: Math.PI / 2,
			cameraMode: CAMERA_MODES.FREE_ORBITAL,
			isSprinting: true,
			velocity: [0, 0, -1],
		});
		expect(mockCreateSmoothedPlayerPhysicsRotation).toHaveBeenCalledWith({
			currentRotation: {
				x: expect.any(Number),
				y: expect.any(Number),
				z: expect.any(Number),
				w: expect.any(Number),
			},
			delta: 0.016,
			rotationTarget: expect.any(THREE.Quaternion),
		});
		expect(body.setLinvel).toHaveBeenCalledWith(
			{
				x: PLAYER_ENTITY_CONFIG.MOVEMENT.SPRINT_SPEED,
				y: 0,
				z: 0,
			},
			true,
		);
		expect(body.setRotation).toHaveBeenCalledWith(smoothedRotation, true);
		expect(mockSetPlayerPosition).toHaveBeenCalledWith(2, 1, -3);
	});

	it("forwards world-relative fallback movement through the helper", () => {
		mockGetCameraMode.mockReturnValue("spectator");
		mockResolvePlayerPhysicsLinearVelocity.mockReturnValue({
			horizontalVelocity: [0, 0, -PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED],
			isMoving: true,
			rotationTarget: new THREE.Quaternion().setFromAxisAngle(
				new THREE.Vector3(0, 1, 0),
				Math.PI,
			),
		});

		const { result } = renderHook(() =>
			usePlayerPhysics({ velocity: [0, 0, -1], isSprinting: false }),
		);
		const body = createFakeBody();

		result.current.rigidBodyRef.current = body as never;

		act(() => {
			frameCallbacks.at(-1)?.({}, 0.016);
		});

		expect(mockResolvePlayerPhysicsLinearVelocity).toHaveBeenCalledWith({
			cameraAzimuth: Math.PI / 2,
			cameraMode: "spectator",
			isSprinting: false,
			velocity: [0, 0, -1],
		});
		expect(body.setLinvel).toHaveBeenCalledWith(
			{
				x: 0,
				y: 0,
				z: -PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED,
			},
			true,
		);
		expect(mockCreateSmoothedPlayerPhysicsRotation).toHaveBeenCalled();
	});

	it("passes a rotation-like object from Rapier to smoothing helpers", () => {
		const smoothedRotation = new THREE.Quaternion().setFromAxisAngle(
			new THREE.Vector3(0, 1, 0),
			Math.PI / 3,
		);
		mockCreateSmoothedPlayerPhysicsRotation.mockReturnValue(smoothedRotation);

		const { result } = renderHook(() =>
			usePlayerPhysics({ velocity: [0, 0, -1], isSprinting: false }),
		);
		const body = createFakeBody();

		result.current.rigidBodyRef.current = body as never;

		act(() => {
			frameCallbacks.at(-1)?.({}, 0.016);
		});

		expect(mockCreateSmoothedPlayerPhysicsRotation).toHaveBeenCalledWith(
			expect.objectContaining({
				currentRotation: { x: 0, y: 0, z: 0, w: 1 },
			}),
		);
		expect(body.setRotation).toHaveBeenCalledWith(smoothedRotation, true);
	});

	it("stops horizontal motion when the helper reports an idle frame", () => {
		mockResolvePlayerPhysicsLinearVelocity.mockReturnValue({
			horizontalVelocity: [0, 0, 0],
			isMoving: false,
			rotationTarget: null,
		});

		const { result } = renderHook(() =>
			usePlayerPhysics({ velocity: [0, 0, 0], isSprinting: false }),
		);
		const body = createFakeBody();

		result.current.rigidBodyRef.current = body as never;

		act(() => {
			frameCallbacks.at(-1)?.({}, 0.016);
		});

		expect(mockResolvePlayerPhysicsLinearVelocity).toHaveBeenCalledWith({
			cameraAzimuth: Math.PI / 2,
			cameraMode: CAMERA_MODES.FREE_ORBITAL,
			isSprinting: false,
			velocity: [0, 0, 0],
		});
		expect(body.setLinvel).toHaveBeenCalledWith({ x: 0, y: 0, z: 0 }, true);
		expect(body.setRotation).not.toHaveBeenCalled();
		expect(mockCreateSmoothedPlayerPhysicsRotation).not.toHaveBeenCalled();
	});
});
