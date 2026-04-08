// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import { useAudioController } from "@/features/audio-manager";
import { CAMERA_MODES, useCameraMachine } from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useStateVisualizer } from "@/features/state-visualizer";
import { GAME_PAGE_COPY } from "@/pages/game/config";

import { useGamePage } from "./useGamePage";

vi.mock("@/features/audio-manager", () => ({
	audioMachine: {},
	useAudioController: vi.fn().mockReturnValue({
		audioState: "playing",
		handleAudioPlayRequest: vi.fn(),
		handleAudioMuteToggle: vi.fn(),
		isAudioMuted: false,
	}),
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachine: vi.fn(),
}));

vi.mock("@/features/camera-system", () => ({
	CAMERA_MODES: {
		THIRD_PERSON: "thirdPerson",
		TOP_DOWN: "topDown",
		FIRST_PERSON: "firstPerson",
		FREE_ORBITAL: "freeOrbital",
	},
	createCameraMachine: vi.fn(() => ({})),
	useCameraMachine: vi.fn().mockReturnValue({
		cameraStateSnapshot: {
			fov: 58,
			mode: "freeOrbital",
			position: [0, 8, 10],
			target: [0, 0, 0],
			zoom: 1,
		},
		handleCameraModeSwitch: vi.fn(),
		mode: "freeOrbital",
	}),
}));

vi.mock("@/features/state-visualizer", () => ({
	useStateVisualizer: vi.fn(),
}));

vi.mock("@/entities/player", () => ({
	PLAYER_EVENTS: { RESTART: "RESTART" },
	PLAYER_ENTITY_CONFIG: {
		TRANSFORM: { SPAWN_HEIGHT_OFFSET: 0.45 },
	},
	createPlayerMachine: vi.fn(() => ({})),
	usePlayerMachineRuntime: vi.fn().mockReturnValue({
		snapshot: {
			value: { health: "alive", movement: "idle" },
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
		rooms: [
			{ roomId: "entrance", position: [0, 0, 0], isInitial: true },
			{ roomId: "guardRoom", position: [20, 0, 0], isInitial: false },
		],
		corridors: [],
		transitions: [],
	})),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	setPlayerTeleportTarget: vi.fn(),
}));

describe("useGamePage", () => {
	it("composes page data from machine and visualizer hooks", () => {
		vi.mocked(useGameMachine).mockReturnValue({
			activeStateLabel: ROOM_IDS.ENTRANCE,
			actionButtons: [],
			currentRoomLabel: "Entrance",
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRoomLabels: ["Entrance"],
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
					audio: {},
					camera: {},
					dungeon: {},
					player: {},
				},
				stateValuesBySectionId: {
					dungeon: ROOM_IDS.ENTRANCE,
					camera: CAMERA_MODES.FREE_ORBITAL,
					audio: "playing",
					player: {
						health: "alive",
						movement: "idle",
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
		expect(result.current.currentRoomLabel).toBe("Entrance");
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
			currentRoomLabel: "Entrance",
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRoomLabels: ["Entrance"],
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
