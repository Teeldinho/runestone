// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PLAYER_EVENTS, usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachine } from "@/features/dungeon-navigation";
import { setPlayerTeleportTarget } from "@/shared/lib";

import { useGamePageReset } from "./useGamePageReset";

vi.mock("@/entities/dungeon", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/dungeon")>();
	return {
		...actual,
		createFloorOneMachine: vi.fn(() => ({
			config: {
				initial: "entrance",
				context: {},
			},
		})),
		createDungeonFloorLayout: vi.fn(() => ({
			rooms: [
				{
					roomId: "entrance",
					position: [5, 0, 10],
					isInitial: true,
				},
			],
			corridors: [],
			transitions: [],
		})),
	};
});

vi.mock("@/entities/player", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/player")>();
	return {
		...actual,
		createPlayerMachine: vi.fn(() => ({})),
		usePlayerMachineRuntime: vi.fn().mockReturnValue({
			snapshot: {
				value: {
					health: actual.PLAYER_STATES.HEALTH.ALIVE,
					movement: actual.PLAYER_STATES.MOVEMENT.IDLE,
				},
				context: {
					position: [0, 0, 0],
					velocity: [0, 0, 0],
					stats: {
						hp: 100,
						maxHp: 100,
						score: 0,
						keyCount: 0,
						chainMultiplier: 1,
					},
				},
			},
			sendPlayerMachineEvent: vi.fn(),
		}),
	};
});

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachine: vi.fn().mockReturnValue({
		activeStateLabel: "entrance",
		actionButtons: [],
		currentRoomLabel: "Entrance",
		currentRoomId: "entrance",
		discoveredRoomLabels: ["Entrance"],
		discoveredRooms: ["entrance"],
		enemiesRemaining: 1,
		handleDungeonRunReset: vi.fn(),
		handleDungeonEventSend: vi.fn(),
		hasTreasureKey: false,
	}),
	useInteractionCandidates: vi.fn().mockReturnValue({
		interactPrompt: null,
		interactEvent: null,
		interactTargetId: null,
		attackPrompt: null,
		attackPosition: null,
		hasInteract: false,
		hasAttack: false,
	}),
	useInteractionInput: vi.fn().mockReturnValue({
		handleAttack: vi.fn(),
		handleInteract: vi.fn(),
		handleJoystickMove: vi.fn(),
		handleJoystickStop: vi.fn(),
	}),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	setPlayerTeleportTarget: vi.fn(),
}));

describe("useGamePageReset", () => {
	it("returns entrance position from dungeon floor layout", () => {
		const { result } = renderHook(() => useGamePageReset());

		expect(result.current.entrancePosition).toBeDefined();
		expect(Array.isArray(result.current.entrancePosition)).toBe(true);
		expect(result.current.entrancePosition.length).toBe(3);
	});

	it("handles dungeon run reset", () => {
		const { result } = renderHook(() => useGamePageReset());

		act(() => {
			result.current.handleDungeonRunReset();
		});

		expect(setPlayerTeleportTarget).toHaveBeenCalledWith(
			expect.any(Number),
			expect.any(Number),
			expect.any(Number),
		);
	});

	it("sends player restart event on reset", () => {
		const mockSendPlayerMachineEvent = vi.fn();

		vi.mocked(usePlayerMachineRuntime).mockReturnValue({
			snapshot: {
				value: {
					health: "alive",
					movement: "idle",
				},
				context: {
					position: [0, 0, 0],
					velocity: [0, 0, 0],
					stats: {
						hp: 100,
						maxHp: 100,
						score: 0,
						keyCount: 0,
						chainMultiplier: 1,
					},
				},
			},
			sendPlayerMachineEvent: mockSendPlayerMachineEvent,
		} as unknown as ReturnType<typeof usePlayerMachineRuntime>);

		const { result } = renderHook(() => useGamePageReset());

		act(() => {
			result.current.handleDungeonRunReset();
		});

		expect(mockSendPlayerMachineEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.RESTART,
		});
	});

	it("calls resetDungeonMachine on reset", () => {
		const mockResetDungeonMachine = vi.fn();

		vi.mocked(useGameMachine).mockReturnValue({
			handleDungeonRunReset: mockResetDungeonMachine,
		} as unknown as ReturnType<typeof useGameMachine>);

		const { result } = renderHook(() => useGamePageReset());

		act(() => {
			result.current.handleDungeonRunReset();
		});

		expect(mockResetDungeonMachine).toHaveBeenCalledTimes(1);
	});
});
