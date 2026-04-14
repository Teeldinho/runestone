// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import { PLAYER_STATES, usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachine } from "@/features/dungeon-navigation";
import {
	STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer,
} from "@/features/state-visualizer";
import { GAME_PAGE_COPY } from "../config";

import { useGamePageState } from "./useGamePageState";

vi.mock("@/features/state-visualizer", () => ({
	STATE_VISUALIZER_SECTION_IDS: {
		DUNGEON: "DUNGEON",
		CAMERA: "CAMERA",
		AUDIO: "AUDIO",
		PLAYER: "PLAYER",
	},
	useStateVisualizer: vi.fn(() => ({
		sections: [],
	})),
}));

vi.mock("@/features/audio-manager", () => ({
	audioMachine: {},
	useAudioController: vi.fn(() => ({
		audioState: { isMuted: false },
	})),
}));

vi.mock("@/features/camera-system", () => ({
	createCameraMachine: vi.fn(() => ({})),
	useCameraMachine: vi.fn(() => ({
		mode: "FREE_ORBITAL",
	})),
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachine: vi.fn(),
}));

vi.mock("@/entities/player", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/player")>();
	return {
		...actual,
		createPlayerMachine: vi.fn(() => ({})),
		usePlayerMachineRuntime: vi.fn(),
	};
});

vi.mock("@/entities/dungeon", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/dungeon")>();
	return {
		...actual,
		createFloorOneMachine: vi.fn(() => ({})),
	};
});

describe("useGamePageState", () => {
	it("returns dungeon machine state", () => {
		vi.mocked(useGameMachine).mockReturnValue({
			activeStateLabel: ROOM_IDS.ENTRANCE,
			actionButtons: [],
			currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			enemiesRemaining: 1,
			handleDungeonRunReset: vi.fn(),
			handleDungeonEventSend: vi.fn(),
			hasTreasureKey: false,
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(usePlayerMachineRuntime).mockReturnValue({
			snapshot: {
				value: {
					movement: PLAYER_STATES.MOVEMENT.IDLE,
					health: PLAYER_STATES.HEALTH.ALIVE,
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
					isSprinting: false,
				},
			},
			sendPlayerMachineEvent: vi.fn(),
		} as unknown as ReturnType<typeof usePlayerMachineRuntime>);

		const { result } = renderHook(() => useGamePageState());

		expect(result.current.activeStateLabel).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.currentRoomLabel).toBe(
			ROOM_LABELS[ROOM_IDS.ENTRANCE],
		);
		expect(result.current.enemiesRemaining).toBe(1);
	});

	it("returns player HP", () => {
		vi.mocked(useGameMachine).mockReturnValue({
			activeStateLabel: ROOM_IDS.ENTRANCE,
			actionButtons: [],
			currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			enemiesRemaining: 1,
			handleDungeonRunReset: vi.fn(),
			handleDungeonEventSend: vi.fn(),
			hasTreasureKey: false,
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(usePlayerMachineRuntime).mockReturnValue({
			snapshot: {
				value: {
					movement: PLAYER_STATES.MOVEMENT.IDLE,
					health: PLAYER_STATES.HEALTH.ALIVE,
				},
				context: {
					position: [0, 0, 0],
					velocity: [0, 0, 0],
					stats: {
						hp: 75,
						maxHp: 100,
						score: 0,
						keyCount: 0,
						chainMultiplier: 1,
					},
					isSprinting: false,
				},
			},
			sendPlayerMachineEvent: vi.fn(),
		} as unknown as ReturnType<typeof usePlayerMachineRuntime>);

		const { result } = renderHook(() => useGamePageState());

		expect(result.current.playerHp).toBe(75);
		expect(result.current.playerMaxHp).toBe(100);
	});

	it("returns hasTreasureKeyLabel correctly", () => {
		vi.mocked(useGameMachine).mockReturnValue({
			activeStateLabel: ROOM_IDS.ENTRANCE,
			actionButtons: [],
			currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			enemiesRemaining: 1,
			handleDungeonRunReset: vi.fn(),
			handleDungeonEventSend: vi.fn(),
			hasTreasureKey: true,
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(usePlayerMachineRuntime).mockReturnValue({
			snapshot: {
				value: {
					movement: PLAYER_STATES.MOVEMENT.IDLE,
					health: PLAYER_STATES.HEALTH.ALIVE,
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
					isSprinting: false,
				},
			},
			sendPlayerMachineEvent: vi.fn(),
		} as unknown as ReturnType<typeof usePlayerMachineRuntime>);

		const { result } = renderHook(() => useGamePageState());

		expect(result.current.hasTreasureKeyLabel).toBe(
			GAME_PAGE_COPY.TREASURE_KEY_STATUS.ACQUIRED,
		);
	});

	it("returns canvasMachineRuntime", () => {
		vi.mocked(useGameMachine).mockReturnValue({
			activeStateLabel: ROOM_IDS.ENTRANCE,
			actionButtons: [],
			currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			enemiesRemaining: 3,
			handleDungeonRunReset: vi.fn(),
			handleDungeonEventSend: vi.fn(),
			hasTreasureKey: false,
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(usePlayerMachineRuntime).mockReturnValue({
			snapshot: {
				value: {
					movement: PLAYER_STATES.MOVEMENT.IDLE,
					health: PLAYER_STATES.HEALTH.ALIVE,
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
					isSprinting: false,
				},
			},
			sendPlayerMachineEvent: vi.fn(),
		} as unknown as ReturnType<typeof usePlayerMachineRuntime>);

		const mockSections = [
			{
				id: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
				label: "Dungeon",
				activeStateLabel: "entrance",
				guardKeys: [],
				nodes: [],
				edges: [],
				positionedNodes: [],
			},
		];
		vi.mocked(useStateVisualizer).mockReturnValue({
			sections: mockSections,
		});

		const { result } = renderHook(() => useGamePageState());

		expect(result.current.canvasMachineRuntime).toEqual({
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 3,
			hasTreasureKey: false,
		});
		expect(result.current.graphSections).toEqual(mockSections);
	});
});
