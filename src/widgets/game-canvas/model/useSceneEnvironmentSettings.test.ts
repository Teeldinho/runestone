// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { createFloorOneMachine, ROOM_IDS } from "@/entities/dungeon";
import {
	createPlayerMeshSettings,
	PLAYER_ENTITY_CONFIG,
} from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";

const mockCreateSceneEnvironmentSettingsViewModel = vi.fn(
	(input: {
		defaultPlayerMeshSettings: unknown;
		enemiesRemaining: number;
		floorLayout: unknown;
		hasTreasureKey: boolean;
	}) => ({
		corridorMeshSettings: [
			{
				id: `corridor-${input.enemiesRemaining}`,
				position: [0, 0, 0],
				rotationYRad: 0,
			},
		],
		enemyMeshSettings: [
			{
				id: `enemy-${input.enemiesRemaining}`,
			},
		],
		playerMeshSettings: input.defaultPlayerMeshSettings,
		roomMeshSettings: [
			{
				roomId: input.hasTreasureKey ? "unlocked" : "locked",
			},
		],
	}),
);

import { useSceneEnvironmentSettings } from "./useSceneEnvironmentSettings";

vi.mock("@/widgets/game-canvas/lib", () => ({
	createSceneEnvironmentSettingsViewModel: (input: {
		defaultPlayerMeshSettings: unknown;
		enemiesRemaining: number;
		floorLayout: unknown;
		hasTreasureKey: boolean;
	}) => mockCreateSceneEnvironmentSettingsViewModel(input),
}));

const mockRuntimeContext = vi.hoisted(() => ({
	currentRoomId: "entrance",
	hasTreasureKey: false,
	enemiesRemaining: 1,
}));

vi.mock("@/features/dungeon-navigation", () => ({
	selectDoorwayNavigationContext: vi.fn(),
	useGameMachineSelector: () => mockRuntimeContext,
}));

const consoleWarnSpy = vi.hoisted(() => {
	return vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
	consoleWarnSpy.mockRestore();
});

describe("useSceneEnvironmentSettings", () => {
	beforeEach(() => {
		mockCreateSceneEnvironmentSettingsViewModel.mockClear();
		mockRuntimeContext.currentRoomId = ROOM_IDS.ENTRANCE;
		mockRuntimeContext.hasTreasureKey = false;
		mockRuntimeContext.enemiesRemaining = 1;
	});

	it("passes the gathered inputs to the scene-environment builder", () => {
		const { result } = renderHook(() => useSceneEnvironmentSettings());
		const defaultPlayerMeshSettings = createPlayerMeshSettings({
			healthState: PLAYER_ENTITY_CONFIG.DEFAULTS.HEALTH_STATE,
			origin: PLAYER_ENTITY_CONFIG.ORIGIN,
		});
		const floorLayout = createDungeonFloorLayout(createFloorOneMachine());

		expect(mockCreateSceneEnvironmentSettingsViewModel).toHaveBeenCalledWith({
			defaultPlayerMeshSettings,
			enemiesRemaining: 1,
			floorLayout,
			hasTreasureKey: false,
		});
		expect(result.current).toMatchObject({
			corridorMeshSettings: [{ id: "corridor-1" }],
			enemyMeshSettings: [{ id: "enemy-1" }],
			playerMeshSettings: defaultPlayerMeshSettings,
			roomMeshSettings: [{ roomId: "locked" }],
		});
	});

	it("rebuilds the view model when the doorway context changes", () => {
		const { result, rerender } = renderHook(() =>
			useSceneEnvironmentSettings(),
		);

		expect(result.current.corridorMeshSettings[0].id).toBe("corridor-1");
		expect(result.current.roomMeshSettings[0].roomId).toBe("locked");

		mockRuntimeContext.hasTreasureKey = true;
		mockRuntimeContext.enemiesRemaining = 0;
		rerender();

		expect(
			mockCreateSceneEnvironmentSettingsViewModel,
		).toHaveBeenLastCalledWith(
			expect.objectContaining({
				enemiesRemaining: 0,
				hasTreasureKey: true,
			}),
		);
		expect(result.current.corridorMeshSettings[0].id).toBe("corridor-0");
		expect(result.current.roomMeshSettings[0].roomId).toBe("unlocked");
	});
});
