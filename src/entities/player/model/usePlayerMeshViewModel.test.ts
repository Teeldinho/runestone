// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PLAYER_ENTITY_CONFIG } from "../config";

vi.mock("@react-three/fiber", () => ({
	useFrame: vi.fn(),
}));

vi.mock("./playerMachineRuntime", () => ({
	usePlayerMachineRuntime: vi.fn(() => ({
		snapshot: {
			value: { movement: "idle", health: "alive" },
			context: {
				position: [0, 0, 0],
				velocity: [0, 0, 0],
				stats: { maxHp: 100, hp: 100, score: 0, keyCount: 0, chainMultiplier: 1 },
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
			auraColor: "var(--color-dungeon-rune-active)",
			auraEmissiveIntensity: 1.25,
			position: [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0],
		});
	});

	it("returns mesh settings reflecting damaged health state", () => {
		vi.mocked(usePlayerMachineRuntime).mockReturnValueOnce({
			snapshot: {
				value: { movement: "idle", health: "damaged" },
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
			} as ReturnType<typeof usePlayerMachineRuntime>["snapshot"],
			sendPlayerMachineEvent: vi.fn(),
		});

		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.meshSettings.auraColor).toBe(
			"var(--color-dungeon-torch)",
		);
		expect(result.current.meshSettings.auraEmissiveIntensity).toBe(1.1);
	});

	it("returns a rigidBodyRef initialised to null", () => {
		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.rigidBodyRef).toBeDefined();
		expect(result.current.rigidBodyRef.current).toBeNull();
	});
});
