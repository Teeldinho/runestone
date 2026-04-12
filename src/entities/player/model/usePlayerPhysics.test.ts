// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/shared/config";
import { PLAYER_ENTITY_CONFIG } from "../config";

const frameCallbacks: Array<() => void> = [];
const mockGetCameraMode = vi.fn();
const mockGetCameraAzimuth = vi.fn();
const mockConsumePlayerTeleportTarget = vi.fn();
const mockSetPlayerPosition = vi.fn();

vi.mock("@react-three/fiber", () => ({
	useFrame: (callback: () => void) => {
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

	return {
		translation: () => ({ x: 2, y: 1, z: -3 }),
		linvel: () => currentLinvel,
		rotation: () => ({ x: 0, y: 0, z: 0, w: 1 }),
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
		mockGetCameraAzimuth.mockReturnValue(Math.PI / 2);
		mockConsumePlayerTeleportTarget.mockReturnValue(null);
	});

	it("applies camera-relative movement in free-orbital mode", () => {
		mockGetCameraMode.mockReturnValue(CAMERA_MODES.FREE_ORBITAL);
		const { result } = renderHook(() =>
			usePlayerPhysics({ velocity: [0, 0, -1], isSprinting: false }),
		);
		const body = createFakeBody();

		result.current.rigidBodyRef.current = body as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(body.setLinvel).toHaveBeenCalledWith(
			{
				x: PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED,
				y: 0,
				z: expect.closeTo(0, 6),
			},
			true,
		);
	});

	it("applies camera-relative movement in top-down mode", () => {
		mockGetCameraMode.mockReturnValue(CAMERA_MODES.TOP_DOWN);
		const { result } = renderHook(() =>
			usePlayerPhysics({ velocity: [0, 0, -1], isSprinting: true }),
		);
		const body = createFakeBody();

		result.current.rigidBodyRef.current = body as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(body.setLinvel).toHaveBeenCalledWith(
			{
				x: PLAYER_ENTITY_CONFIG.MOVEMENT.SPRINT_SPEED,
				y: 0,
				z: expect.closeTo(0, 6),
			},
			true,
		);
	});

	it("falls back to world-relative movement for unknown modes", () => {
		mockGetCameraMode.mockReturnValue("spectator");
		const { result } = renderHook(() =>
			usePlayerPhysics({ velocity: [0, 0, -1], isSprinting: false }),
		);
		const body = createFakeBody();

		result.current.rigidBodyRef.current = body as never;

		act(() => {
			frameCallbacks.at(-1)?.();
		});

		expect(body.setLinvel).toHaveBeenCalledWith(
			{
				x: 0,
				y: 0,
				z: -PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED,
			},
			true,
		);
	});
});
