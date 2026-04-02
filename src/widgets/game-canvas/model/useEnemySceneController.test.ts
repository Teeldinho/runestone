// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PLAYER_EVENTS } from "@/entities/player";
import { ENEMY_CONFIG } from "@/shared/config";

const mockSendPlayerMachineEvent = vi.fn();
const mockSendDungeonMachineEvent = vi.fn();
const mockOnEnemyHit = vi.fn();
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
	useSendDungeonMachineEvent: () => mockSendDungeonMachineEvent,
}));

vi.mock("@/features/haptics-feedback", () => ({
	useHaptics: () => ({
		onEnemyHit: mockOnEnemyHit,
	}),
}));

import { useEnemySceneController } from "./useEnemySceneController";

describe("useEnemySceneController", () => {
	beforeEach(() => {
		vi.clearAllMocks();
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

	it("handleEnemyAttack triggers onEnemyHit haptic", () => {
		const { result } = renderHook(() => useEnemySceneController());

		act(() => {
			result.current.handleEnemyAttack();
		});

		expect(mockOnEnemyHit).toHaveBeenCalled();
	});

	it("handleEnemyDead sends ENEMY_DIED to dungeon machine", () => {
		const { result } = renderHook(() => useEnemySceneController());

		act(() => {
			result.current.handleEnemyDead();
		});

		expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
			type: "ENEMY_DIED",
		});
	});
});
