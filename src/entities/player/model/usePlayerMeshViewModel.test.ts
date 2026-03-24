// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
	it("returns mesh settings reflecting alive health state", () => {
		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.meshSettings).toEqual({
			auraColor: "#00d7ff",
			auraEmissiveIntensity: 1.25,
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
});
