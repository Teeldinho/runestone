// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PLAYER_EVENTS } from "@/entities/player";
import { ENEMY_CONFIG } from "@/shared/config";

const mockSendPlayerMachineEvent = vi.fn();
const mockSendDungeonMachineEvent = vi.fn();

const { mockPlayerSnapshotGetter } = vi.hoisted(() => ({
	mockPlayerSnapshotGetter: vi.fn(),
}));

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
		snapshot: mockPlayerSnapshotGetter(),
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

const createMockPlayerSnapshot = () => ({
	context: { position: [0, 0, 0] as [number, number, number] },
});

import { useEnemySceneController } from "./useEnemySceneController";

describe("useEnemySceneController — handleEnemyAttack", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		mockPlayerSnapshotGetter.mockReturnValue(createMockPlayerSnapshot());
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("handleEnemyAttack sends TAKE_DAMAGE with ATTACK_DAMAGE amount", () => {
		const { result } = renderHook(() => useEnemySceneController());

		act(() => {
			result.current.handleEnemyAttack();
		});

		expect(mockSendPlayerMachineEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: ENEMY_CONFIG.ATTACK_DAMAGE,
		});
	});

	it("handleEnemyAttack is stable across re-renders", () => {
		const { result, rerender } = renderHook(() => useEnemySceneController());
		const firstRef = result.current.handleEnemyAttack;

		rerender();

		expect(result.current.handleEnemyAttack).toBe(firstRef);
	});
});
