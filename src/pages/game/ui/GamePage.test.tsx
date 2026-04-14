// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DUNGEON_EVENTS, ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import {
	useGamePageAudio,
	useGamePageLayout,
	useGamePageReset,
	useGamePageSheet,
	useGamePageTouch,
} from "@/pages/game/model";
import { GamePage } from "./GamePage";

const TEST_NAVIGATION_ACTION_LABELS = {
	[DUNGEON_EVENTS.ENTER_LIBRARY]: "Enter Library",
} as const;

vi.mock("@/pages/game/model", () => ({
	useGamePageAudio: vi.fn(() => ({
		isAudioMuted: false,
		handleAudioMuteToggle: vi.fn(),
		handleAudioPlayRequest: vi.fn(),
	})),
	useGamePageCamera: vi.fn(() => ({
		cameraStateSnapshot: {
			fov: 58,
			mode: CAMERA_MODES.FREE_ORBITAL,
			position: [0, 8, 10] as [number, number, number],
			target: [0, 0, 0] as [number, number, number],
			zoom: 1,
		},
		handleCameraModeSwitch: vi.fn(),
		cameraMode: CAMERA_MODES.FREE_ORBITAL,
	})),
	useGamePageLayout: vi.fn(() => ({
		isDesktopLayout: true,
		isTabletLayout: false,
		isMobileTabletLandscape: false,
	})),
	useGamePageReset: vi.fn(() => ({
		entrancePosition: [0, 0, 0] as const,
		handleDungeonRunReset: vi.fn(),
	})),
	useGamePageSheet: vi.fn(() => ({
		isMobileSheetOpen: false,
		mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		handleMobileSheetOpenChange: vi.fn(),
		handleMobileSheetTabChange: vi.fn(),
	})),
	useGamePageState: vi.fn(() => ({
		actionButtons: [
			{
				eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
				label: TEST_NAVIGATION_ACTION_LABELS[DUNGEON_EVENTS.ENTER_LIBRARY],
				isDisabled: false,
				handleDungeonActionTrigger: vi.fn(),
			},
		],
		activeStateLabel: ROOM_IDS.ENTRANCE,
		canvasMachineRuntime: {
			currentRoomId: ROOM_IDS.ENTRANCE,
			enemiesRemaining: 1,
			hasTreasureKey: false,
		},
		currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
		discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
		enemiesRemaining: 1,
		graphSections: [],
		hasTreasureKeyLabel: "Treasure Key: Missing",
		playerHp: 100,
		playerMaxHp: 100,
	})),
	useGamePageTouch: vi.fn(() => ({
		hasTouchAttack: false,
		hasTouchInteract: false,
		touchAttackPrompt: null,
		touchInteractPrompt: null,
		handleTouchAttack: vi.fn(),
		handleTouchInteract: vi.fn(),
		handleTouchJoystickMove: vi.fn(),
		handleTouchJoystickStop: vi.fn(),
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

vi.mock("@/features/touch-input", () => ({
	TouchJoystickOverlay: () => <div data-testid="touch-joystick-widget" />,
	CameraControlZone: () => <div data-testid="camera-control-zone-widget" />,
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

afterEach(() => {
	cleanup();
});

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

	it("renders touch overlays and bottom-sheet trigger on mobile and tablet landscape", () => {
		vi.mocked(useGamePageLayout).mockReturnValue({
			isDesktopLayout: false,
			isTabletLayout: true,
			isMobileTabletLandscape: true,
		});
		vi.mocked(useGamePageTouch).mockReturnValue({
			hasTouchAttack: true,
			hasTouchInteract: true,
			touchAttackPrompt: "Attack",
			touchInteractPrompt: "Enter Library",
			handleTouchAttack: vi.fn(),
			handleTouchInteract: vi.fn(),
			handleTouchJoystickMove: vi.fn(),
			handleTouchJoystickStop: vi.fn(),
		});
		vi.mocked(useGamePageSheet).mockReturnValue({
			isMobileSheetOpen: false,
			mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
			handleMobileSheetOpenChange: vi.fn(),
			handleMobileSheetTabChange: vi.fn(),
		});
		vi.mocked(useGamePageAudio).mockReturnValue({
			isAudioMuted: false,
			handleAudioMuteToggle: vi.fn(),
			handleAudioPlayRequest: vi.fn(),
		});
		vi.mocked(useGamePageReset).mockReturnValue({
			entrancePosition: [0, 0.9, 0] as [number, 0.9, number],
			handleDungeonRunReset: vi.fn(),
		});

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
		vi.mocked(useGamePageLayout).mockReturnValue({
			isDesktopLayout: false,
			isTabletLayout: false,
			isMobileTabletLandscape: false,
		});

		render(<GamePage />);

		expect(screen.getByText("Rotate Device")).not.toBeNull();
		expect(
			screen.queryByRole("button", {
				name: GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL,
			}),
		).toBeNull();
	});
});
