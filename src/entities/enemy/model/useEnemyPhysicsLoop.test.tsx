// @vitest-environment happy-dom

import type { RapierRigidBody } from "@react-three/rapier";
import { act, renderHook } from "@testing-library/react";
import * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ENEMY_EVENTS } from "../config";

const frameCallbacks: Array<(state: unknown, delta: number) => void> = [];
const mockGetPlayerPosition = vi.fn();
const mockSetEnemyPosition = vi.fn();
const mockRemoveEnemyPosition = vi.fn();

vi.mock("@react-three/fiber", () => ({
	useFrame: (callback: (state: unknown, delta: number) => void) => {
		frameCallbacks.push(callback);
	},
}));

vi.mock("@/shared/lib", async (importOriginal) => {
	const original = await importOriginal<typeof import("@/shared/lib")>();

	return {
		...original,
		getPlayerPosition: () => mockGetPlayerPosition(),
		removeEnemyPosition: (...args: unknown[]) =>
			mockRemoveEnemyPosition(...args),
		setEnemyPosition: (...args: unknown[]) => mockSetEnemyPosition(...args),
	};
});

import { useEnemyPhysicsLoop } from "./useEnemyPhysicsLoop";

const createRigidBodyMock = () =>
	({
		linvel: vi.fn(() => ({ x: 0, y: 0.75, z: 0 })),
		position: vi.fn(),
		rotation: vi.fn(() => new THREE.Quaternion()),
		setLinvel: vi.fn(),
		setRotation: vi.fn(),
		translation: vi.fn(() => ({ x: 10, y: 0.91, z: 5 })),
	}) as unknown as RapierRigidBody;

describe("useEnemyPhysicsLoop", () => {
	beforeEach(() => {
		frameCallbacks.length = 0;
		vi.clearAllMocks();
		mockGetPlayerPosition.mockReturnValue([0, 0.91, 0]);
	});

	it("syncs player position and updates movement on the frame tick", () => {
		const rigidBody = createRigidBodyMock();
		const send = vi.fn();

		renderHook(() =>
			useEnemyPhysicsLoop({
				getNextPosition: () => [13, 0.91, 9],
				id: "enemy-1",
				position: [10, 0.91, 5],
				rigidBodyRef: { current: rigidBody },
				send,
			}),
		);

		vi.clearAllMocks();
		mockGetPlayerPosition.mockReturnValue([0.5, 0.91, 0]);

		act(() => {
			frameCallbacks.at(-1)?.(undefined, 0.2);
		});

		expect(mockSetEnemyPosition).toHaveBeenCalledWith("enemy-1", 10, 0.91, 5);
		expect(send).toHaveBeenCalledWith({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [0.5, 0.91, 0],
		});
		expect(rigidBody.setLinvel).toHaveBeenCalledWith(
			{
				x: 15,
				y: 0.75,
				z: 20,
			},
			true,
		);
		expect(rigidBody.setRotation).toHaveBeenCalledTimes(1);
	});

	it("returns immediately when the frame delta is zero", () => {
		const rigidBody = createRigidBodyMock();
		const send = vi.fn();

		renderHook(() =>
			useEnemyPhysicsLoop({
				getNextPosition: () => [13, 0.91, 9],
				id: "enemy-1",
				position: [10, 0.91, 5],
				rigidBodyRef: { current: rigidBody },
				send,
			}),
		);

		vi.clearAllMocks();

		act(() => {
			frameCallbacks.at(-1)?.(undefined, 0);
		});

		expect(mockSetEnemyPosition).not.toHaveBeenCalled();
		expect(send).not.toHaveBeenCalled();
		expect(rigidBody.setLinvel).not.toHaveBeenCalled();
		expect(rigidBody.setRotation).not.toHaveBeenCalled();
	});

	it("cleans up the enemy position on unmount", () => {
		const rigidBody = createRigidBodyMock();

		const { unmount } = renderHook(() =>
			useEnemyPhysicsLoop({
				getNextPosition: () => [13, 0.91, 9],
				id: "enemy-1",
				position: [10, 0.91, 5],
				rigidBodyRef: { current: rigidBody },
				send: vi.fn(),
			}),
		);

		expect(mockSetEnemyPosition).toHaveBeenCalledWith("enemy-1", 10, 0.91, 5);

		unmount();

		expect(mockRemoveEnemyPosition).toHaveBeenCalledWith("enemy-1");
	});
});
