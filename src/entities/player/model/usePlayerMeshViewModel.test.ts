// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { setCameraMode } from "@/shared/lib";

import { PLAYER_ENTITY_CONFIG, PLAYER_STATES } from "../config";

vi.mock("@/shared/lib", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/shared/lib")>();

	return {
		...actual,
		useResponsiveLayout: vi.fn(() => ({
			isDesktopLayout: true,
			isMobileLayout: false,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		})),
	};
});

vi.mock("@react-three/fiber", () => ({
	useFrame: vi.fn(),
}));

import { createActor, fromTransition } from "xstate";

const createMockActorRef = () => {
	const logic = fromTransition((s: unknown) => s, null);

	return createActor(logic);
};

vi.mock("./playerMachineRuntime", () => ({
	usePlayerMachineRuntime: vi.fn(() => ({
		snapshot: {
			value: {
				[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
				[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.ALIVE,
			},
			context: {
				position: [0, 0, 0],
				velocity: [0, 0, 0],
				stats: {
					maxHp: 100,
					hp: 100,
					score: 0,
					keyCount: 0,
					chainMultiplier: 1,
				},
			},
		},
		sendPlayerMachineEvent: vi.fn(),
		playerActorRef: createMockActorRef(),
	})),
}));

import { usePlayerMachineRuntime } from "./playerMachineRuntime";
import { usePlayerMeshViewModel } from "./usePlayerMeshViewModel";

describe("usePlayerMeshViewModel", () => {
	beforeEach(() => {
		setCameraMode("thirdPerson");
	});

	it("hides the avatar in first-person mode", () => {
		setCameraMode("firstPerson");

		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.isAvatarVisible).toBe(false);
		expect(result.current.meshSettings.position).toEqual([
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			0,
		]);
	});

	it("returns mesh settings at the spawn position by default", () => {
		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.meshSettings.position).toEqual([
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			0,
		]);
	});

	it("shows the running indicator on desktop while moving fast", () => {
		vi.mocked(usePlayerMachineRuntime).mockReturnValueOnce({
			snapshot: {
				value: {
					[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.RUNNING,
					[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.ALIVE,
				},
				context: {
					position: [0, 0, 0],
					velocity: [0, 0, 0],
					stats: {
						maxHp: 100,
						hp: 100,
						score: 0,
						keyCount: 0,
						chainMultiplier: 1,
					},
				},
			} as unknown as ReturnType<typeof usePlayerMachineRuntime>["snapshot"],
			sendPlayerMachineEvent: vi.fn(),
			playerActorRef: createMockActorRef(),
		});

		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.isRunningIndicatorVisible).toBe(true);
	});

	it("returns a rigidBodyRef initialised to null", () => {
		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.rigidBodyRef).toBeDefined();
		expect(result.current.rigidBodyRef.current).toBeNull();
	});

	it("updates avatar visibility when the camera mode changes after mount", () => {
		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.isAvatarVisible).toBe(true);

		act(() => {
			setCameraMode("firstPerson");
		});

		expect(result.current.isAvatarVisible).toBe(false);
	});

	it("keeps the initial spawn position stable after mount", () => {
		const initialPosition: [number, number, number] = [
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			0,
		];
		const movedRoomPosition: [number, number, number] = [
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			20,
		];

		const { result, rerender } = renderHook(
			({ position }: { position: readonly [number, number, number] }) =>
				usePlayerMeshViewModel({
					initialPosition: [...position],
				}),
			{
				initialProps: { position: initialPosition },
			},
		);

		expect(result.current.meshSettings.position).toEqual(initialPosition);

		rerender({ position: movedRoomPosition });

		expect(result.current.meshSettings.position).toEqual(initialPosition);
	});
});
