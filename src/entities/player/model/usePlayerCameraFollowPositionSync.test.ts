// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { RefObject } from "react";
import type * as THREE from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GAME_FRAME_PRIORITIES } from "@/shared/config";

const frameCallbacks: Array<(...args: unknown[]) => void> = [];
const framePriorities: Array<number | undefined> = [];
const mockSetPlayerCameraFollowPosition = vi.fn();

vi.mock("@react-three/fiber", () => ({
	useFrame: (callback: (...args: unknown[]) => void, priority?: number) => {
		frameCallbacks.push(callback);
		framePriorities.push(priority);
	},
}));

vi.mock("@/shared/lib", () => ({
	setPlayerCameraFollowPosition: (...args: unknown[]) =>
		mockSetPlayerCameraFollowPosition(...args),
}));

import { usePlayerCameraFollowPositionSync } from "./usePlayerCameraFollowPositionSync";

const createGroupRef = (): RefObject<THREE.Group | null> =>
	({
		current: {
			getWorldPosition: vi.fn((target: THREE.Vector3) => target.set(4, 1, -2)),
		} as unknown as THREE.Group,
	}) as RefObject<THREE.Group | null>;

describe("usePlayerCameraFollowPositionSync", () => {
	const runFrame = (priority: number) => {
		const index = framePriorities.indexOf(priority);

		if (index === -1) {
			throw new Error(`Missing frame callback for priority ${priority}`);
		}

		frameCallbacks[index]?.();
	};

	beforeEach(() => {
		frameCallbacks.length = 0;
		framePriorities.length = 0;
		vi.clearAllMocks();
	});

	it("syncs the rendered player group world position on the camera-follow frame priority", () => {
		const groupRef = createGroupRef();

		const { result } = renderHook(() =>
			usePlayerCameraFollowPositionSync({
				groupRef,
			}),
		);

		expect(result.current).toBeUndefined();
		expect(framePriorities).toEqual([
			GAME_FRAME_PRIORITIES.PLAYER_CAMERA_FOLLOW_POSITION_SYNC,
		]);

		act(() => {
			runFrame(GAME_FRAME_PRIORITIES.PLAYER_CAMERA_FOLLOW_POSITION_SYNC);
		});

		expect(groupRef.current?.getWorldPosition).toHaveBeenCalledTimes(1);
		expect(mockSetPlayerCameraFollowPosition).toHaveBeenCalledWith(4, 1, -2);
	});

	it("does nothing before the rendered player group is mounted", () => {
		const groupRef = {
			current: null,
		} as RefObject<THREE.Group | null>;

		renderHook(() =>
			usePlayerCameraFollowPositionSync({
				groupRef,
			}),
		);

		act(() => {
			runFrame(GAME_FRAME_PRIORITIES.PLAYER_CAMERA_FOLLOW_POSITION_SYNC);
		});

		expect(mockSetPlayerCameraFollowPosition).not.toHaveBeenCalled();
	});
});
