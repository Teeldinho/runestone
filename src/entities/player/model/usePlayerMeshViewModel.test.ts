// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PLAYER_ENTITY_CONFIG, PLAYER_STATES } from "../config";

const mockGetCameraMode = vi.fn(() => "thirdPerson");
const cameraModeListeners = new Set<() => void>();

vi.mock("@react-three/fiber", () => ({
	useFrame: vi.fn(),
}));

vi.mock("@/shared/lib/cameraModeStore", () => ({
	getCameraMode: () => mockGetCameraMode(),
	subscribeToCameraMode: (listener: () => void) => {
		cameraModeListeners.add(listener);

		return () => {
			cameraModeListeners.delete(listener);
		};
	},
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
	it("hides the avatar in first-person mode", () => {
		mockGetCameraMode.mockReturnValue("firstPerson");

		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.isAvatarVisible).toBe(false);
		expect(result.current.isAuraVisible).toBe(false);
	});

	it("returns mesh settings reflecting alive health state", () => {
		mockGetCameraMode.mockReturnValue("thirdPerson");

		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.meshSettings).toEqual({
			auraColor: "#00d7ff",
			auraEmissiveIntensity: 2.0,
			position: [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0],
		});
	});

	it("returns mesh settings reflecting damaged health state", () => {
		mockGetCameraMode.mockReturnValue("thirdPerson");

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
		mockGetCameraMode.mockReturnValue("thirdPerson");

		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.rigidBodyRef).toBeDefined();
		expect(result.current.rigidBodyRef.current).toBeNull();
	});

	it("updates avatar visibility when the camera mode changes after mount", () => {
		mockGetCameraMode.mockReturnValue("thirdPerson");

		const { result } = renderHook(() => usePlayerMeshViewModel());

		expect(result.current.isAvatarVisible).toBe(true);

		mockGetCameraMode.mockReturnValue("firstPerson");

		act(() => {
			for (const listener of cameraModeListeners) {
				listener();
			}
		});

		expect(result.current.isAvatarVisible).toBe(false);
		expect(result.current.isAuraVisible).toBe(false);
	});
});
