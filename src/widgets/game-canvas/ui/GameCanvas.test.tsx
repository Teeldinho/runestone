// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";

import { GameCanvas } from "./GameCanvas";

const mockUseInteractionCandidates = vi.fn();
const mockUseInteractionInput = vi.fn();
const mockUseSendDungeonMachineEvent = vi.fn();
const mockSceneEnvironment = vi.fn((_props: unknown) => (
	<div data-testid="scene-environment" />
));

vi.mock("@react-three/drei", () => ({
	AdaptiveDpr: () => null,
	PerformanceMonitor: () => null,
	useAnimations: () => ({ actions: {} }),
	useGLTF: Object.assign(() => ({ animations: [], scene: null }), {
		preload: vi.fn(),
	}),
}));

vi.mock("@react-three/fiber", () => ({
	Canvas: ({ children }: { children: ReactNode }) => (
		<div data-testid="canvas">{children}</div>
	),
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
}));

vi.mock("@/entities/room", () => ({
	ROOM_ENTITY_CONFIG: {
		DOORWAY_GATE: { POSITION_Y: 1 },
		TREASURE_KEY: { HEIGHT: 0.5 },
	},
	RoomLabel: () => null,
	RoomMesh: () => null,
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useInteractionCandidates: () => mockUseInteractionCandidates(),
	useInteractionInput: (input: unknown) => mockUseInteractionInput(input),
	useSendDungeonMachineEvent: () => mockUseSendDungeonMachineEvent(),
}));

vi.mock("../model", () => ({
	useAchievementTracker: () => ({ activeAchievement: null }),
	useCanvasMachineSettings: () => ({
		camera: { far: 120, fov: 58, near: 0.1, position: [0, 18, 18], zoom: 1 },
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
	}),
	useFirstPersonLockHint: () => false,
	useGameOverState: () => ({ handleGameRestart: vi.fn(), isGameOver: false }),
	useGameSideEffects: vi.fn(),
	usePlayerSceneController: vi.fn(),
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

describe("GameCanvas", () => {
	it("computes interaction candidates once and shares them with input and scene rendering", () => {
		const candidates = {
			interactPrompt: "Enter Library",
			interactEvent: "ENTER_LIBRARY",
			interactTargetId: "entrance:south",
			attackPrompt: null,
			attackPosition: null,
			hasInteract: true,
			hasAttack: false,
		};
		const sendDungeonMachineEvent = vi.fn();

		mockUseInteractionCandidates.mockReturnValue(candidates);
		mockUseSendDungeonMachineEvent.mockReturnValue(sendDungeonMachineEvent);

		render(
			<GameCanvas
				cameraStateSnapshot={{
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [0, 18, 18],
					target: [0, 0, 0],
					zoom: 1,
				}}
				machineRuntime={{
					currentRoomId: "entrance",
					enemiesRemaining: 1,
					hasTreasureKey: false,
				}}
				postprocessingEnabled={false}
			/>,
		);

		expect(mockUseInteractionCandidates).toHaveBeenCalledTimes(1);
		expect(mockUseInteractionInput).toHaveBeenCalledWith({
			candidates,
			sendDungeonMachineEvent,
		});
		expect(mockSceneEnvironment).toHaveBeenCalledWith(
			expect.objectContaining({
				interactionCandidates: candidates,
			}),
		);
	});
});
