// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { DungeonContext } from "@/entities/dungeon";
import { FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";
import { useAudioController } from "@/features/audio-manager";
import { CAMERA_MODES, useCameraSystem } from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useStateVisualizer } from "@/features/state-visualizer";
import { GAME_PAGE_COPY } from "@/pages/game/config";

import { useGamePage } from "./useGamePage";

vi.mock("@/features/audio-manager", () => ({
	useAudioController: vi.fn().mockReturnValue({
		handleAudioPlayRequest: vi.fn(),
		handleAudioMuteToggle: vi.fn(),
		isAudioMuted: false,
	}),
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachine: vi.fn(),
}));

vi.mock("@/features/camera-system", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/features/camera-system")>();

	return {
		...actual,
		useCameraSystem: vi.fn(),
	};
});

vi.mock("@/features/state-visualizer", () => ({
	useStateVisualizer: vi.fn(),
}));

vi.mock("@/entities/player", () => ({
	PLAYER_EVENTS: { RESTART: "RESTART" },
	PLAYER_ENTITY_CONFIG: {
		TRANSFORM: { SPAWN_HEIGHT_OFFSET: 0.45 },
	},
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
		rooms: [{ roomId: "entrance", position: [0, 0, 0], isInitial: true }],
		corridors: [],
		transitions: [],
	})),
}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	setPlayerTeleportTarget: vi.fn(),
}));

describe("useGamePage", () => {
	it("composes page data from machine and visualizer hooks", () => {
		const machineContext: DungeonContext = {
			currentFloorId: FLOOR_IDS.FLOOR_ONE,
			currentRoomId: ROOM_IDS.ENTRANCE,
			discoveredRooms: [ROOM_IDS.ENTRANCE],
			hasTreasureKey: false,
			enemiesRemaining: 1,
		};

		vi.mocked(useGameMachine).mockReturnValue({
			actionButtons: [],
			currentRoomLabel: "Entrance",
			discoveredRoomLabels: ["Entrance"],
			handleDungeonRunReset: vi.fn(),
			handleDungeonEventSend: vi.fn(),
			snapshot: {
				context: machineContext,
				value: ROOM_IDS.ENTRANCE,
			},
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(useCameraSystem).mockReturnValue({
			cameraStateSnapshot: {
				fov: 58,
				mode: CAMERA_MODES.FREE_ORBITAL,
				position: [10, 10, 10],
				target: [0, 0, 0],
				zoom: 1,
			},
			handleCameraModeSwitch: vi.fn(),
		} as unknown as ReturnType<typeof useCameraSystem>);

		vi.mocked(useStateVisualizer).mockReturnValue({
			edges: [],
			nodes: [],
			positionedNodes: [],
		} as unknown as ReturnType<typeof useStateVisualizer>);

		const { result } = renderHook(() => useGamePage());

		expect(useStateVisualizer).toHaveBeenCalledWith({
			context: machineContext,
		});
		expect(result.current.canvasMachineRuntime).toEqual({
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 1,
			hasTreasureKey: false,
		});
		expect(result.current.hasTreasureKeyLabel).toBe(
			GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		);
		expect(result.current.cameraStateSnapshot.mode).toBe(
			CAMERA_MODES.FREE_ORBITAL,
		);
		expect(result.current.activeStateLabel).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.currentRoomLabel).toBe("Entrance");
		expect(result.current.isAudioMuted).toBe(false);
		expect(result.current.handleAudioMuteToggle).toBeDefined();
		expect(
			vi.mocked(useAudioController)().handleAudioPlayRequest,
		).toHaveBeenCalled();
	});
});
