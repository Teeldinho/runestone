// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DUNGEON_EVENTS, ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { GAME_PAGE_COPY, GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { useGamePage } from "@/pages/game/model";

import { GamePage } from "./GamePage";

const TEST_NAVIGATION_ACTION_LABELS = {
	[DUNGEON_EVENTS.ENTER_LIBRARY]: "Enter Library",
} as const;

const createGamePageViewModel = (overrides = {}) => ({
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
		position: [0, 8, 10] as [number, number, number],
		target: [0, 0, 0] as [number, number, number],
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
	handleMobileSheetOpenChange: vi.fn(),
	handleMobileSheetTabChange: vi.fn(),
	handleTouchAttack: vi.fn(),
	handleTouchInteract: vi.fn(),
	handleTouchJoystickMove: vi.fn(),
	handleTouchJoystickStop: vi.fn(),
	hasTouchAttack: false,
	hasTouchInteract: false,
	handleAudioMuteToggle: vi.fn(),
	isAudioMuted: false,
	isDesktopLayout: true,
	isMobileSheetOpen: false,
	isMobileTabletLandscape: false,
	isTabletLayout: false,
	mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
	hasTreasureKeyLabel: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
	handleDungeonRunReset: vi.fn(),
	playerHp: 100,
	playerMaxHp: 100,
	touchAttackPrompt: null,
	touchInteractPrompt: null,
	...overrides,
});

vi.mock("@/pages/game/model", () => ({
	useGamePage: vi.fn(),
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

vi.mock("@/features/touch-input", () => ({
	TouchJoystickOverlay: () => <div data-testid="touch-joystick-widget" />,
	CameraControlZone: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="camera-control-zone-widget">{children}</div>
	),
}));

vi.mock("@/widgets/game-canvas", () => ({
	GameCanvas: () => <div data-testid="game-canvas-widget" />,
}));

vi.mock("@/widgets/camera-mode-switcher", () => ({
	CameraModeSwitcher: () => <div data-testid="camera-switcher-widget" />,
	MobileCameraModeSwitcher: () => (
		<div data-testid="mobile-camera-switcher-widget" />
	),
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

vi.mock("@/widgets/leaderboard-panel", () => ({
	LeaderboardSheet: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="leaderboard-sheet-widget">{children}</div>
	),
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

afterEach(() => {
	cleanup();
});

describe("GamePage", () => {
	beforeEach(() => {
		vi.mocked(useGamePage).mockReturnValue(createGamePageViewModel());
	});

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

	it("renders touch overlays and bottom-sheet trigger on mobile and tablet landscape", () => {
		vi.mocked(useGamePage).mockReturnValue(
			createGamePageViewModel({
				isDesktopLayout: false,
				hasTouchAttack: true,
				hasTouchInteract: true,
				isMobileTabletLandscape: true,
				isTabletLayout: true,
				touchAttackPrompt: "Attack",
				touchInteractPrompt: "Enter Library",
			}),
		);

		render(<GamePage />);

		expect(screen.getByTestId("touch-joystick-widget")).not.toBeNull();
		expect(
			screen.getByRole("button", {
				name: "Enter Library",
			}),
		).not.toBeNull();
		expect(
			screen.getByRole("button", {
				name: "Attack",
			}),
		).not.toBeNull();
		expect(
			screen.getByRole("button", {
				name: GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL,
			}),
		).not.toBeNull();
	});

	it("renders rotate-device banner in touch portrait mode", () => {
		vi.mocked(useGamePage).mockReturnValue(
			createGamePageViewModel({
				isDesktopLayout: false,
				isMobileTabletLandscape: false,
			}),
		);

		render(<GamePage />);

		expect(screen.getByText("Rotate Device")).not.toBeNull();
		expect(
			screen.queryByRole("button", {
				name: GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL,
			}),
		).toBeNull();
	});
});
