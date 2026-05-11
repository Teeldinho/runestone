// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";

import { useGameCanvasViewModel } from "./useGameCanvasViewModel";

const mockUseCanvasMachineSettings = vi.fn(
	(
		_machineRuntime?: unknown,
		_cameraStateSnapshot?: unknown,
		_postprocessingEnabled?: unknown,
	) => ({
		camera: { far: 120, fov: 58, near: 0.1, position: [0, 16, -18], zoom: 1 },
		environment: { isDungeonReady: true },
		fog: { color: "#000000" },
		lighting: { ambientIntensity: 0.8 },
		postprocessing: { bloom: { intensity: 0.1 }, vignette: { darkness: 0.1 } },
		playerSpawnPosition: [0, 0.9, 0],
		renderer: { dprRange: [0.75, 1.25], shadowsEnabled: false },
		isPostprocessingEnabled: false,
	}),
);

const mockUsePlayerSceneController = vi.fn();
const mockUseGameSideEffects = vi.fn();
const mockUseGameOverState = vi.fn(() => ({
	handleGameRestart: vi.fn(),
	isGameOver: false,
}));
const mockUseAchievementTracker = vi.fn(() => ({
	activeAchievement: null,
}));
const mockUseFirstPersonLockHint = vi.fn((_value?: unknown) => false);

vi.mock("./useCanvasMachineSettings", () => ({
	useCanvasMachineSettings: (
		machineRuntime: unknown,
		cameraStateSnapshot: unknown,
		postprocessingEnabled: unknown,
	) =>
		mockUseCanvasMachineSettings(
			machineRuntime,
			cameraStateSnapshot,
			postprocessingEnabled,
		),
}));

vi.mock("./usePlayerSceneController", () => ({
	usePlayerSceneController: () => mockUsePlayerSceneController(),
}));

vi.mock("./useGameSideEffects", () => ({
	useGameSideEffects: () => mockUseGameSideEffects(),
}));

vi.mock("./useGameOverState", () => ({
	useGameOverState: () => mockUseGameOverState(),
}));

vi.mock("./useAchievementTracker", () => ({
	useAchievementTracker: () => mockUseAchievementTracker(),
}));

vi.mock("./useFirstPersonLockHint", () => ({
	useFirstPersonLockHint: (value: unknown) => mockUseFirstPersonLockHint(value),
}));

describe("useGameCanvasViewModel", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns composed canvas + overlay view-model data", () => {
		const cameraStateSnapshot = {
			fov: 58,
			mode: CAMERA_MODES.FREE_ORBITAL,
			position: [0, 16, -18] as [number, number, number],
			target: [0, 0, 0] as [number, number, number],
			zoom: 1,
			yaw: 0,
			pitch: 0,
			distance: 6,
		};

		const machineRuntime = {
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 1,
			hasTreasureKey: false,
		};

		const { result } = renderHook(() =>
			useGameCanvasViewModel({
				cameraStateSnapshot,
				machineRuntime,
				postprocessingEnabled: false,
			}),
		);

		expect(result.current.canvasSettings.camera.fov).toBe(58);
		expect(result.current.isGameOver).toBe(false);
		expect(result.current.showFirstPersonLockHint).toBe(false);
		expect(result.current.activeAchievement).toBeNull();
	});

	it("runs scene side-effect hooks and forwards selector inputs", () => {
		const cameraStateSnapshot = {
			fov: 58,
			mode: CAMERA_MODES.TOP_DOWN,
			position: [0, 16, -18] as [number, number, number],
			target: [0, 0, 0] as [number, number, number],
			zoom: 1,
			yaw: 0,
			pitch: 0,
			distance: 6,
		};

		const machineRuntime = {
			currentRoomId: ROOM_IDS.GUARD_ROOM,
			enemiesRemaining: 2,
			hasTreasureKey: true,
		};

		renderHook(() =>
			useGameCanvasViewModel({
				cameraStateSnapshot,
				machineRuntime,
				postprocessingEnabled: true,
			}),
		);

		expect(mockUseCanvasMachineSettings).toHaveBeenCalledWith(
			machineRuntime,
			cameraStateSnapshot,
			true,
		);
		expect(mockUseFirstPersonLockHint).toHaveBeenCalledWith({
			mode: CAMERA_MODES.TOP_DOWN,
		});
		expect(mockUsePlayerSceneController).toHaveBeenCalledTimes(1);
		expect(mockUseGameSideEffects).toHaveBeenCalledTimes(1);
	});
});
