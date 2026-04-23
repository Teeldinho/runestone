// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	PLAYER_ENTITY_CONFIG,
	PLAYER_EVENTS,
	PLAYER_STATES,
	type PlayerHealthState,
} from "@/entities/player";
import { DUNGEON_MACHINE_SYSTEM_EVENTS } from "@/features/dungeon-navigation";

const mockSendPlayerMachineEvent = vi.fn();
const mockSendDungeonMachineEvent = vi.fn();
const mockSetPlayerTeleportTarget = vi.fn();

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
		REGIONS: { HEALTH: "health", MOVEMENT: "movement" },
		HEALTH: { ALIVE: "alive", DAMAGED: "damaged", DEAD: "dead" },
		MOVEMENT: { IDLE: "idle", WALKING: "walking" },
	},
	PLAYER_ENTITY_CONFIG: {
		TRANSFORM: { SPAWN_HEIGHT_OFFSET: 0.45 },
	},
}));

vi.mock("@/entities/dungeon", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/dungeon")>();
	return {
		...actual,
		createFloorOneMachine: vi.fn(() => ({})),
	};
});

vi.mock("@/entities/room", () => ({
	createDungeonFloorLayout: vi.fn(() => ({
		rooms: [{ roomId: "entrance", position: [0, 0, 0], isInitial: true }],
		corridors: [],
		transitions: [],
	})),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	setPlayerTeleportTarget: (...args: unknown[]) =>
		mockSetPlayerTeleportTarget(...args),
}));

vi.mock("@/features/dungeon-navigation", () => ({
	DUNGEON_MACHINE_SYSTEM_EVENTS: { RESET_DUNGEON_RUN: "RESET_DUNGEON_RUN" },
	useSendDungeonMachineEvent: () => mockSendDungeonMachineEvent,
}));

const createMockPlayerSnapshot = (
	healthState: PlayerHealthState = PLAYER_STATES.HEALTH.ALIVE,
) => ({
	value: {
		[PLAYER_STATES.REGIONS.HEALTH]: healthState,
		[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
	},
	context: {
		isSprinting: false,
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
			createMockPlayerSnapshot(PLAYER_STATES.HEALTH.DAMAGED),
		);
		const { result } = renderHook(() => useGameOverState());

		expect(result.current.isGameOver).toBe(false);
	});

	it("isGameOver is true when player health is dead", () => {
		mockPlayerSnapshotGetter.mockReturnValue(
			createMockPlayerSnapshot(PLAYER_STATES.HEALTH.DEAD),
		);
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
			type: DUNGEON_MACHINE_SYSTEM_EVENTS.RESET_DUNGEON_RUN,
		});
	});

	it("handleGameRestart teleports player to entrance spawn", () => {
		const { result } = renderHook(() => useGameOverState());

		act(() => {
			result.current.handleGameRestart();
		});

		expect(mockSetPlayerTeleportTarget).toHaveBeenCalledWith(
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			0,
		);
	});
});
