// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DUNGEON_EVENTS, ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { GAME_PAGE_COPY } from "@/pages/game/config";

import { GamePage } from "./GamePage";

const TEST_NAVIGATION_ACTION_LABELS = {
	[DUNGEON_EVENTS.ENTER_LIBRARY]: "Enter Library",
} as const;

vi.mock("@/pages/game/model", () => ({
	useGamePage: vi.fn(() => ({
		actionButtons: [
			{
				eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
				label: TEST_NAVIGATION_ACTION_LABELS[DUNGEON_EVENTS.ENTER_LIBRARY],
				isDisabled: false,
				handleDungeonActionTrigger: vi.fn(),
			},
		],
		activeStateLabel: ROOM_IDS.ENTRANCE,
		cameraStateSnapshot: {
			fov: 58,
			mode: CAMERA_MODES.FREE_ORBITAL,
			position: [0, 8, 10],
			target: [0, 0, 0],
			zoom: 1,
		},
		canvasMachineRuntime: {
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 1,
			hasTreasureKey: false,
		},
		currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
		discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
		enemiesRemaining: 1,
		graphSections: [],
		handleCameraModeSwitch: vi.fn(),
		handleAudioMuteToggle: vi.fn(),
		isAudioMuted: false,
		hasTreasureKeyLabel: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		handleDungeonRunReset: vi.fn(),
		playerHp: 100,
		playerMaxHp: 100,
	})),
}));

vi.mock("@/features/settings", () => ({
	useSettingsForm: vi.fn(() => ({
		postprocessingEnabled: true,
		hapticsEnabled: true,
		masterVolume: 50,
		musicVolume: 50,
		handlePostprocessingToggle: vi.fn(),
		handleHapticsToggle: vi.fn(),
		handleMasterVolumeChange: vi.fn(),
		handleMusicVolumeChange: vi.fn(),
		handleSettingsReset: vi.fn(),
	})),
}));

vi.mock("@/widgets/game-canvas", () => ({
	GameCanvas: () => <div data-testid="game-canvas-widget" />,
}));

vi.mock("@/widgets/camera-mode-switcher", () => ({
	CameraModeSwitcher: () => <div data-testid="camera-switcher-widget" />,
}));

vi.mock("@/widgets/xstate-inspector-panel", () => ({
	XStateInspectorPanel: () => <div data-testid="xstate-inspector-widget" />,
	XStateInspectorDetailsPanel: () => (
		<div data-testid="xstate-inspector-details-widget" />
	),
}));

vi.mock("@/widgets/hud", () => ({
	GameHud: () => <div data-testid="hud-widget-marker" />,
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useInteractionCandidates: vi.fn(() => ({
		interactPrompt: null,
		interactEvent: null,
		attackPrompt: null,
		hasInteract: false,
		hasAttack: false,
	})),
	useInteractionInput: vi.fn(),
	useSendDungeonMachineEvent: vi.fn(() => vi.fn()),
}));

describe("GamePage", () => {
	it("renders the HUD widget composition", () => {
		render(<GamePage />);

		expect(screen.getByTestId("game-canvas-widget")).not.toBeNull();
		expect(screen.getByTestId("camera-switcher-widget")).not.toBeNull();
		expect(screen.getByTestId("hud-widget-marker")).not.toBeNull();
		expect(screen.getByTestId("xstate-inspector-widget")).not.toBeNull();
		expect(
			screen.getByTestId("xstate-inspector-details-widget"),
		).not.toBeNull();
	});
});
