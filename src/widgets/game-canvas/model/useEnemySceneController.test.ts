// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PLAYER_EVENTS } from "@/entities/player";
import { ENEMY_CONFIG } from "@/shared/config";

const mockSendPlayerMachineEvent = vi.fn();
const mockSendDungeonMachineEvent = vi.fn();
const mockOnEnemyHit = vi.fn();
const mockGetPlayerPosition = vi.fn();
const mockGetPlayerPositionSnapshot = vi.fn();
const mockSubscribeToPlayerPosition = vi.fn();

vi.mock("@/entities/player", () => ({
	PLAYER_EVENTS: {
		TAKE_DAMAGE: "TAKE_DAMAGE",
		MOVE: "MOVE",
		STOP: "STOP",
		HEAL: "HEAL",
		DIE: "DIE",
	},
	usePlayerMachineRuntime: () => ({
		sendPlayerMachineEvent: mockSendPlayerMachineEvent,
	}),
}));

vi.mock("@/entities/dungeon", () => ({
	DUNGEON_EVENTS: { ENEMY_DIED: "ENEMY_DIED" },
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachineRuntime: () => ({
		sendDungeonMachineEvent: mockSendDungeonMachineEvent,
	}),
}));

vi.mock("@/features/haptics-feedback", () => ({
	useHaptics: () => ({
		onEnemyHit: mockOnEnemyHit,
	}),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	getPlayerPosition: () => mockGetPlayerPosition(),
	getPlayerPositionSnapshot: () => mockGetPlayerPositionSnapshot(),
	subscribeToPlayerPosition: (listener: () => void) => {
		mockSubscribeToPlayerPosition(listener);
		return () => {};
	},
}));

import { useEnemySceneController } from "./useEnemySceneController";

describe("useEnemySceneController", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("handleEnemyAttack sends TAKE_DAMAGE with ATTACK_DAMAGE amount", () => {
		mockGetPlayerPosition.mockReturnValue([3, 0, -2]);

		const { result } = renderHook(() => useEnemySceneController());

		act(() => {
			result.current.handleEnemyAttack();
		});

		expect(mockSendPlayerMachineEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: ENEMY_CONFIG.ATTACK_DAMAGE,
		});
	});

	it("handleEnemyAttack triggers onEnemyHit haptic", () => {
		mockGetPlayerPosition.mockReturnValue([0, 0, 0]);

		const { result } = renderHook(() => useEnemySceneController());

		act(() => {
			result.current.handleEnemyAttack();
		});

		expect(mockOnEnemyHit).toHaveBeenCalled();
	});

	it("returns live player position from playerPositionStore", () => {
		mockGetPlayerPositionSnapshot.mockReturnValue([9, 1.5, 4]);

		const { result } = renderHook(() => useEnemySceneController());

		expect(result.current.playerPosition).toEqual([9, 1.5, 4]);
		expect(mockSubscribeToPlayerPosition).toHaveBeenCalled();
		expect(mockGetPlayerPositionSnapshot).toHaveBeenCalled();
	});

	it("handleEnemyDead sends ENEMY_DIED to dungeon machine", () => {
		mockGetPlayerPosition.mockReturnValue([0, 0, 0]);

		const { result } = renderHook(() => useEnemySceneController());

		act(() => {
			result.current.handleEnemyDead();
		});

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: "ENEMY_DIED",
		});
	});
});
