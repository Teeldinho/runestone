// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ROOM_IDS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { GAME_FRAME_PRIORITIES } from "@/shared/config";

import { GameCanvasRuntime } from "./GameCanvasRuntime";

const mockSceneEnvironment = vi.fn((_props: unknown) => (
	<div data-testid="scene-environment" />
));
const mockWorldInteractionRuntime = vi.fn(() => (
	<div data-testid="world-interaction-runtime" />
));
const mockPhysics = vi.fn(({ children }: { children: ReactNode }) => (
	<>{children}</>
));
const mockCanvas = vi.fn(({ children }: { children: ReactNode }) => (
	<div data-testid="canvas">{children}</div>
));
const mockHandleSceneReady = vi.fn();
const mockUseFirstPersonLockHint = vi.fn(
	({ mode }: { mode: unknown }) => mode === CAMERA_MODES.FIRST_PERSON,
);
const mockUseGameCanvasSceneLoading = vi.fn(() => ({
	handleSceneReady: mockHandleSceneReady,
	isSceneLoading: true,
}));
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

vi.mock("@/features/responsive-layout", () => ({
	useResponsiveGameLayout: () => ({
		isDesktopLayout: true,
		isMobileLayout: false,
		isTabletLayout: false,
		isLandscape: true,
		isPortrait: false,
	}),
}));

vi.mock("@react-three/postprocessing", () => ({
	Bloom: () => null,
	EffectComposer: ({ children }: { children: ReactNode }) => <>{children}</>,
	Vignette: () => null,
}));

vi.mock("@react-three/rapier", () => ({
	Physics: (props: { children: ReactNode }) => mockPhysics(props),
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
	PlayerRunningIndicator: () => null,
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
	useGameCanvasSceneLoading: () => mockUseGameCanvasSceneLoading(),
	useGameCanvasViewModel: (value: unknown) => mockUseGameCanvasViewModel(value),
	useFirstPersonLockHint: (value: { mode: unknown }) =>
		mockUseFirstPersonLockHint(value),
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

describe("GameCanvasRuntime", () => {
	beforeEach(() => {
		mockCanvas.mockClear();
		mockHandleSceneReady.mockClear();
		mockUseFirstPersonLockHint.mockClear();
		mockSceneEnvironment.mockClear();
		mockUseGameCanvasSceneLoading.mockClear();
		mockUseGameCanvasViewModel.mockClear();
		mockWorldInteractionRuntime.mockClear();
		mockPhysics.mockClear();
	});

	it("shows a loading overlay until the 3D scene reports ready", () => {
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

		render(
			<GameCanvasRuntime
				cameraStateSnapshot={cameraStateSnapshot}
				machineRuntime={machineRuntime}
				postprocessingEnabled={false}
			/>,
		);

		expect(screen.getByLabelText("Loading dungeon scene")).not.toBeNull();
	});

	it("renders the narrow interaction runtime separately from the scene environment", () => {
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

		render(
			<GameCanvasRuntime
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
		expect(mockPhysics).toHaveBeenCalledWith(
			expect.objectContaining({
				updatePriority: GAME_FRAME_PRIORITIES.PHYSICS_STEP,
			}),
		);
	});

	it("renders the first-person pointer lock hint when in desktop first-person mode", () => {
		const cameraStateSnapshot = {
			fov: 58,
			mode: CAMERA_MODES.FIRST_PERSON,
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

		render(
			<GameCanvasRuntime
				cameraStateSnapshot={cameraStateSnapshot}
				machineRuntime={machineRuntime}
				postprocessingEnabled={false}
			/>,
		);

		expect(screen.getByText("Click to enter first-person")).toBeTruthy();
	});
});
