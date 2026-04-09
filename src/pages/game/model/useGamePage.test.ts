// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import { PLAYER_STATES } from "@/entities/player";
import {
	AUDIO_MACHINE_STATES,
	useAudioController,
} from "@/features/audio-manager";
import { CAMERA_MODES, useCameraMachine } from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import {
	STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer,
} from "@/features/state-visualizer";
import { GAME_PAGE_COPY } from "@/pages/game/config";

import { useGamePage } from "./useGamePage";

const {
	MOCK_AUDIO_MACHINE_STATES,
	MOCK_CAMERA_MODES,
	MOCK_STATE_VISUALIZER_SECTION_IDS,
} = vi.hoisted(() => ({
	MOCK_AUDIO_MACHINE_STATES: {
		PLAYING: "playing",
	} as const,
	MOCK_CAMERA_MODES: {
		THIRD_PERSON: "thirdPerson",
		TOP_DOWN: "topDown",
		FIRST_PERSON: "firstPerson",
		FREE_ORBITAL: "freeOrbital",
	} as const,
	MOCK_STATE_VISUALIZER_SECTION_IDS: {
		DUNGEON: "dungeon",
		CAMERA: "camera",
		AUDIO: "audio",
		PLAYER: "player",
	} as const,
}));

vi.mock("@/features/audio-manager", () => {
	return {
		AUDIO_MACHINE_STATES: MOCK_AUDIO_MACHINE_STATES,
		audioMachine: {},
		useAudioController: vi.fn().mockReturnValue({
			audioState: MOCK_AUDIO_MACHINE_STATES.PLAYING,
			handleAudioPlayRequest: vi.fn(),
			handleAudioMuteToggle: vi.fn(),
			isAudioMuted: false,
		}),
	};
});

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachine: vi.fn(),
}));

vi.mock("@/features/camera-system", () => {
	return {
		CAMERA_MODES: MOCK_CAMERA_MODES,
		createCameraMachine: vi.fn(() => ({})),
		useCameraMachine: vi.fn().mockReturnValue({
			cameraStateSnapshot: {
				fov: 58,
				mode: MOCK_CAMERA_MODES.FREE_ORBITAL,
				position: [0, 8, 10],
				target: [0, 0, 0],
				zoom: 1,
			},
			handleCameraModeSwitch: vi.fn(),
			mode: MOCK_CAMERA_MODES.FREE_ORBITAL,
		}),
	};
});

vi.mock("@/features/state-visualizer", () => {
	return {
		STATE_VISUALIZER_SECTION_IDS: MOCK_STATE_VISUALIZER_SECTION_IDS,
		useStateVisualizer: vi.fn(),
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

vi.mock("@/entities/dungeon", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/dungeon")>();
	return {
		...actual,
		createFloorOneMachine: vi.fn(() => ({})),
	};
});

vi.mock("@/entities/room", () => {
	return {
		createDungeonFloorLayout: vi.fn(() => ({
			rooms: [
				{ roomId: ROOM_IDS.ENTRANCE, position: [0, 0, 0], isInitial: true },
				{
					roomId: ROOM_IDS.GUARD_ROOM,
					position: [20, 0, 0],
					isInitial: false,
				},
			],
			corridors: [],
			transitions: [],
		})),
	};
});

vi.mock("@/shared/lib/playerPositionStore", () => ({
	setPlayerTeleportTarget: vi.fn(),
}));

describe("useGamePage", () => {
	it("composes page data from machine and visualizer hooks", () => {
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

		vi.mocked(useStateVisualizer).mockReturnValue({
			sections: [],
		} as unknown as ReturnType<typeof useStateVisualizer>);

		const { result } = renderHook(() => useGamePage());

		expect(useStateVisualizer).toHaveBeenCalledWith(
			expect.objectContaining({
				machinesBySectionId: {
					[STATE_VISUALIZER_SECTION_IDS.AUDIO]: {},
					[STATE_VISUALIZER_SECTION_IDS.CAMERA]: {},
					[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: {},
					[STATE_VISUALIZER_SECTION_IDS.PLAYER]: {},
				},
				stateValuesBySectionId: {
					[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: ROOM_IDS.ENTRANCE,
					[STATE_VISUALIZER_SECTION_IDS.CAMERA]: CAMERA_MODES.FREE_ORBITAL,
					[STATE_VISUALIZER_SECTION_IDS.AUDIO]: AUDIO_MACHINE_STATES.PLAYING,
					[STATE_VISUALIZER_SECTION_IDS.PLAYER]: {
						health: PLAYER_STATES.HEALTH.ALIVE,
						movement: PLAYER_STATES.MOVEMENT.IDLE,
					},
				},
			}),
		);
		expect(result.current.canvasMachineRuntime).toEqual({
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 1,
			hasTreasureKey: false,
		});
		expect(result.current.hasTreasureKeyLabel).toBe(
			GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		);
		expect(result.current.activeStateLabel).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.currentRoomLabel).toBe(
			ROOM_LABELS[ROOM_IDS.ENTRANCE],
		);
		expect(result.current.isAudioMuted).toBe(false);
		expect(result.current.cameraStateSnapshot.mode).toBe(
			CAMERA_MODES.FREE_ORBITAL,
		);
		expect(vi.mocked(useCameraMachine)).toHaveBeenCalled();
		expect(result.current.handleAudioMuteToggle).toBeDefined();
		expect(
			vi.mocked(useAudioController)().handleAudioPlayRequest,
		).toHaveBeenCalled();
	});
});

describe("dungeon reset teleport", () => {
	it("teleports player to entrance when dungeon run resets", async () => {
		const { setPlayerTeleportTarget } = await import(
			"@/shared/lib/playerPositionStore"
		);
		const resetDungeonMachine = vi.fn();

		vi.mocked(useGameMachine).mockReturnValue({
			activeStateLabel: ROOM_IDS.ENTRANCE,
			actionButtons: [],
			currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			enemiesRemaining: 0,
			handleDungeonRunReset: resetDungeonMachine,
			handleDungeonEventSend: vi.fn(),
			hasTreasureKey: false,
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(useStateVisualizer).mockReturnValue({
			sections: [],
		} as unknown as ReturnType<typeof useStateVisualizer>);

		const { result } = renderHook(() => useGamePage());

		act(() => {
			result.current.handleDungeonRunReset();
		});

		expect(resetDungeonMachine).toHaveBeenCalledTimes(1);
		expect(setPlayerTeleportTarget).toHaveBeenCalledWith(
			0,
			expect.any(Number),
			0,
		);
	});
});
