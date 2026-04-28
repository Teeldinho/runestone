// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";

import { GameCanvas } from "./GameCanvas";

const mockSceneEnvironment = vi.fn((_props: unknown) => (
	<div data-testid="scene-environment" />
));
const mockWorldInteractionRuntime = vi.fn(() => (
	<div data-testid="world-interaction-runtime" />
));
const mockCanvas = vi.fn(({ children }: { children: ReactNode }) => (
	<div data-testid="canvas">{children}</div>
));
const mockUseGameCanvasViewModel = vi.fn((_value?: unknown) => ({
	canvasSettings: {
		camera: { far: 120, fov: 58, near: 0.1, position: [0, 16, -18], zoom: 1 },
		environment: {},
		fog: {},
		lighting: {},
		postprocessing: {
			bloom: {
				intensity: 0.1,
				luminanceSmoothing: 0.2,
				luminanceThreshold: 0.3,
				mipmapBlur: false,
			},
			vignette: { darkness: 0.1, offset: 0.2 },
		},
		playerSpawnPosition: [0, 0.9, 0],
		renderer: { dprRange: [0.75, 1.25], shadowsEnabled: false },
		isPostprocessingEnabled: false,
	},
	activeAchievement: null,
	handleGameRestart: vi.fn(),
	isGameOver: false,
	showFirstPersonLockHint: false,
}));

vi.mock("@react-three/drei", () => ({
	AdaptiveDpr: () => null,
	PerformanceMonitor: () => null,
	useAnimations: () => ({ actions: {} }),
	useGLTF: Object.assign(() => ({ animations: [], scene: null }), {
		preload: vi.fn(),
	}),
}));

vi.mock("@react-three/fiber", () => ({
	Canvas: (props: { children: ReactNode }) => mockCanvas(props),
}));

vi.mock("@react-three/postprocessing", () => ({
	Bloom: () => null,
	EffectComposer: ({ children }: { children: ReactNode }) => <>{children}</>,
	Vignette: () => null,
}));

vi.mock("@react-three/rapier", () => ({
	Physics: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/features/achievements", () => ({
	AchievementNotification: () => null,
}));

vi.mock("@/entities/corridor", () => ({
	CorridorMesh: () => null,
}));

vi.mock("@/entities/enemy", () => ({
	ENEMY_SPAWN_HEIGHT_OFFSET: 0.91,
	EnemyMesh: () => null,
}));

vi.mock("@/entities/player", () => ({
	PlayerMesh: () => null,
	usePlayerDamageFlash: () => false,
}));

vi.mock("@/entities/room", () => ({
	ROOM_ENTITY_CONFIG: {
		DOORWAY_GATE: { POSITION_Y: 1 },
		TREASURE_KEY: { HEIGHT: 0.5 },
	},
	RoomLabel: () => null,
	RoomMesh: () => null,
}));

vi.mock("../model", () => ({
	useGameCanvasViewModel: (value: unknown) => mockUseGameCanvasViewModel(value),
}));

vi.mock("./CameraRig", () => ({
	CameraRig: () => null,
}));

vi.mock("./GameOverOverlay", () => ({
	GameOverOverlay: () => null,
}));

vi.mock("./SceneEnvironment", () => ({
	SceneEnvironment: (props: unknown) => mockSceneEnvironment(props),
}));

vi.mock("./SceneFog", () => ({
	SceneFog: () => null,
}));

vi.mock("./SceneLighting", () => ({
	SceneLighting: () => null,
}));

vi.mock("./WorldInteractionRuntime", () => ({
	WorldInteractionRuntime: () => mockWorldInteractionRuntime(),
}));

describe("GameCanvas", () => {
	it("renders the narrow interaction runtime separately from the scene environment", () => {
		mockCanvas.mockClear();
		mockUseGameCanvasViewModel.mockClear();

		const cameraStateSnapshot = {
			fov: 58,
			mode: CAMERA_MODES.FREE_ORBITAL,
			position: [0, 16, -18] as [number, number, number],
			target: [0, 0, 0] as [number, number, number],
			zoom: 1,
		};

		const machineRuntime = {
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 1,
			hasTreasureKey: false,
		};

		render(
			<GameCanvas
				cameraStateSnapshot={cameraStateSnapshot}
				machineRuntime={machineRuntime}
				postprocessingEnabled={false}
			/>,
		);

		expect(mockSceneEnvironment).toHaveBeenCalledTimes(1);
		expect(mockWorldInteractionRuntime).toHaveBeenCalledTimes(1);
		expect(mockCanvas).toHaveBeenCalledWith(
			expect.objectContaining({
				className: expect.stringContaining("touch-none"),
			}),
		);
		expect(mockUseGameCanvasViewModel).toHaveBeenCalledWith({
			cameraStateSnapshot,
			machineRuntime,
			postprocessingEnabled: false,
		});
	});
});
