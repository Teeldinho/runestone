// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { setCameraMode } from "@/shared/lib";

import { PLAYER_ENTITY_CONFIG, PLAYER_STATES } from "../config";

vi.mock("@react-three/fiber", () => ({
	useFrame: vi.fn(),
}));

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
		expect(result.current.isAuraVisible).toBe(false);
	});

	it("returns mesh settings reflecting alive health state", () => {
		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.meshSettings).toEqual({
			auraColor: "#00d7ff",
			auraEmissiveIntensity: 2.0,
			position: [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0],
		});
	});

	it("returns mesh settings reflecting damaged health state", () => {
		vi.mocked(usePlayerMachineRuntime).mockReturnValueOnce({
			snapshot: {
				value: {
					[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
					[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.DAMAGED,
				},
				context: {
					position: [0, 0, 0],
					velocity: [0, 0, 0],
					stats: {
						maxHp: 100,
						hp: 90,
						score: 0,
						keyCount: 0,
						chainMultiplier: 1,
					},
				},
			} as unknown as ReturnType<typeof usePlayerMachineRuntime>["snapshot"],
			sendPlayerMachineEvent: vi.fn(),
		});

		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.meshSettings.auraColor).toBe("#ffb347");
		expect(result.current.meshSettings.auraEmissiveIntensity).toBe(1.1);
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
		expect(result.current.isAuraVisible).toBe(false);
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
