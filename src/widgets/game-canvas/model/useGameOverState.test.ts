// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PLAYER_EVENTS } from "@/entities/player";

const mockSendPlayerMachineEvent = vi.fn();
const mockSendDungeonMachineEvent = vi.fn();

const { mockPlayerSnapshotGetter } = vi.hoisted(() => ({
	mockPlayerSnapshotGetter: vi.fn(),
}));

vi.mock("@/entities/player", () => ({
	usePlayerMachineRuntime: () => ({
		sendPlayerMachineEvent: mockSendPlayerMachineEvent,
		snapshot: mockPlayerSnapshotGetter(),
	}),
	PLAYER_EVENTS: {
		RESTART: "RESTART",
		TAKE_DAMAGE: "TAKE_DAMAGE",
		MOVE: "MOVE",
		STOP: "STOP",
		HEAL: "HEAL",
		DIE: "DIE",
	},
	PLAYER_STATES: {
		REGIONS: { HEALTH: "health" },
		HEALTH: { ALIVE: "alive", DAMAGED: "damaged", DEAD: "dead" },
	},
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachineRuntime: () => ({
		sendDungeonMachineEvent: mockSendDungeonMachineEvent,
	}),
	DUNGEON_MACHINE_SYSTEM_EVENTS: { RESET_DUNGEON_RUN: "RESET_DUNGEON_RUN" },
}));

const createMockPlayerSnapshot = (
	healthState: "alive" | "damaged" | "dead" = "alive",
) => ({
	value: { health: healthState, movement: "idle" },
	context: {
		position: [0, 0, 0] as [number, number, number],
		velocity: [0, 0, 0] as [number, number, number],
		stats: { hp: 100, maxHp: 100, score: 0, keyCount: 0, chainMultiplier: 1 },
	},
});

import { useGameOverState } from "./useGameOverState";

describe("useGameOverState", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockPlayerSnapshotGetter.mockReturnValue(createMockPlayerSnapshot());
	});

	it("isGameOver is false when player is alive", () => {
		const { result } = renderHook(() => useGameOverState());

		expect(result.current.isGameOver).toBe(false);
	});

	it("isGameOver is false when player is damaged", () => {
		mockPlayerSnapshotGetter.mockReturnValue(
			createMockPlayerSnapshot("damaged"),
		);
		const { result } = renderHook(() => useGameOverState());

		expect(result.current.isGameOver).toBe(false);
	});

	it("isGameOver is true when player health is dead", () => {
		mockPlayerSnapshotGetter.mockReturnValue(createMockPlayerSnapshot("dead"));
		const { result } = renderHook(() => useGameOverState());

		expect(result.current.isGameOver).toBe(true);
	});

	it("handleGameRestart sends RESTART to player machine", () => {
		const { result } = renderHook(() => useGameOverState());

		act(() => {
			result.current.handleGameRestart();
		});

		expect(mockSendPlayerMachineEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.RESTART,
		});
	});

	it("handleGameRestart resets the dungeon run", () => {
		const { result } = renderHook(() => useGameOverState());

		act(() => {
			result.current.handleGameRestart();
		});

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: "RESET_DUNGEON_RUN",
		});
	});

	it("handleGameRestart is stable across re-renders", () => {
		const { result, rerender } = renderHook(() => useGameOverState());
		const firstRef = result.current.handleGameRestart;

		rerender();

		expect(result.current.handleGameRestart).toBe(firstRef);
	});
});
