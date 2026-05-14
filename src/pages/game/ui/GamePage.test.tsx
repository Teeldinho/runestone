// @vitest-environment happy-dom

import { cleanup, render, screen, within } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createActor, fromTransition } from "xstate";
import { DUNGEON_EVENTS, ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import { CAMERA_MODES } from "@/features/camera-system";
import {
	GAME_PAGE_CONTROLS,
	GAME_PAGE_COPY,
	GAME_PAGE_MOBILE_SHEET,
} from "@/pages/game/config";
import { useGamePage } from "@/pages/game/model";

import { TooltipProvider } from "@/shared/ui";

import { GamePage } from "./GamePage";

const createMockActorRef = () => {
	const logic = fromTransition((s: unknown) => s, null);

	return createActor(logic);
};

const TEST_NAVIGATION_ACTION_LABELS = {
	[DUNGEON_EVENTS.ENTER_LIBRARY]: "Enter Library",
} as const;

const createGamePageViewModel = (overrides = {}) => {
	const defaultViewModel = {
		audio: {
			handleAudioMuteToggle: vi.fn(),
			isAudioMuted: false,
		},
		canvas: {
			cameraActorRef: {
				send: vi.fn(),
			} as unknown as ReturnType<
				typeof useGamePage
			>["canvas"]["cameraActorRef"],
			cameraStateSnapshot: {
				fov: 58,
				mode: CAMERA_MODES.FREE_ORBITAL,
				position: [0, 8, 10] as [number, number, number],
				target: [0, 0, 0] as [number, number, number],
				zoom: 1,
				yaw: 0,
				pitch: 0,
				distance: 6,
			},
			canvasMachineRuntime: {
				currentRoomId: ROOM_IDS.ENTRANCE,
				enemiesRemaining: 1,
				hasTreasureKey: false,
			},
			handleCameraModeSwitch: vi.fn(),
		},
		hud: {
			actionButtons: [
				{
					eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
					label: TEST_NAVIGATION_ACTION_LABELS[DUNGEON_EVENTS.ENTER_LIBRARY],
					isDisabled: false,
					handleDungeonActionTrigger: vi.fn(),
				},
			],
			currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
			enemiesRemaining: 1,
			hasTreasureKeyLabel: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
			handleDungeonRunReset: vi.fn(),
			nearInteractableLabel: "—",
			playerHp: 100,
			playerMaxHp: 100,
		},
		layout: {
			isDesktopLayout: true,
			isMobileTabletLandscape: false,
			isTabletLayout: false,
		},
		mobileSheet: {
			handleMobileSheetOpenChange: vi.fn(),
			handleMobileSheetTabChange: vi.fn(),
			isMobileSheetOpen: false,
			mobileSheetTabId: GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		},
		touch: {
			handleTouchAttack: vi.fn(),
			handleTouchInteract: vi.fn(),
			handleTouchJoystickMove: vi.fn(),
			handleTouchJoystickStop: vi.fn(),
			hasTouchAttack: false,
			hasTouchInteract: false,
			touchAttackPrompt: null,
			touchInteractPrompt: null,
		},
		visualizer: {
			graphSections: [],
		},
	};

	const overrideSlices = overrides as {
		audio?: Partial<(typeof defaultViewModel)["audio"]>;
		canvas?: Partial<(typeof defaultViewModel)["canvas"]>;
		hud?: Partial<(typeof defaultViewModel)["hud"]>;
		layout?: Partial<(typeof defaultViewModel)["layout"]>;
		mobileSheet?: Partial<(typeof defaultViewModel)["mobileSheet"]>;
		touch?: Partial<(typeof defaultViewModel)["touch"]>;
		visualizer?: Partial<(typeof defaultViewModel)["visualizer"]>;
	};

	return {
		...defaultViewModel,
		audio: {
			...defaultViewModel.audio,
			...overrideSlices.audio,
		},
		canvas: {
			...defaultViewModel.canvas,
			...overrideSlices.canvas,
		},
		hud: {
			...defaultViewModel.hud,
			...overrideSlices.hud,
		},
		layout: {
			...defaultViewModel.layout,
			...overrideSlices.layout,
		},
		mobileSheet: {
			...defaultViewModel.mobileSheet,
			...overrideSlices.mobileSheet,
		},
		touch: {
			...defaultViewModel.touch,
			...overrideSlices.touch,
		},
		visualizer: {
			...defaultViewModel.visualizer,
			...overrideSlices.visualizer,
		},
	};
};

vi.mock("@/pages/game/model", () => {
	const useGamePage = vi.fn();

	return {
		GamePageViewModelProvider: ({
			children,
		}: {
			children: React.ReactNode;
		}) => <>{children}</>,
		useGamePage,
		useGamePageCameraElements: () => ({
			cameraControlElement: null,
			cameraControlRef: vi.fn(),
			firstPersonLookElement: null,
			firstPersonLookRef: vi.fn(),
		}),
		useGamePageDesktopLayoutModel: () => {
			const viewModel = useGamePage();

			return {
				cameraStateSnapshot: viewModel.canvas.cameraStateSnapshot,
				canvasMachineRuntime: viewModel.canvas.canvasMachineRuntime,
				currentRoomLabel: viewModel.hud.currentRoomLabel,
				graphSections: viewModel.visualizer.graphSections,
				handleAudioMuteToggle: viewModel.audio.handleAudioMuteToggle,
				handleCameraModeSwitch: viewModel.canvas.handleCameraModeSwitch,
				isAudioMuted: viewModel.audio.isAudioMuted,
				isMobileTabletLandscape: viewModel.layout.isMobileTabletLandscape,
				postprocessingEnabled: true,
			};
		},
		useGamePageDesktopHeaderModel: () => {
			const viewModel = useGamePage();

			return {
				currentRoomLabel: viewModel.hud.currentRoomLabel,
				handleAudioMuteToggle: viewModel.audio.handleAudioMuteToggle,
				isAudioMuted: viewModel.audio.isAudioMuted,
			};
		},
		useGamePageHudPanelModel: () => {
			const viewModel = useGamePage();

			return {
				actionButtons: viewModel.hud.actionButtons,
				currentRoomLabel: viewModel.hud.currentRoomLabel,
				discoveredRoomLabels: viewModel.hud.discoveredRoomLabels,
				enemiesRemaining: viewModel.hud.enemiesRemaining,
				handleDungeonRunReset: viewModel.hud.handleDungeonRunReset,
				hasTreasureKeyLabel: viewModel.hud.hasTreasureKeyLabel,
				nearInteractableLabel: viewModel.hud.nearInteractableLabel,
				playerHp: viewModel.hud.playerHp,
				playerMaxHp: viewModel.hud.playerMaxHp,
			};
		},
		useGamePageLayoutMode: () => {
			const viewModel = useGamePage();

			return {
				isDesktopLayout: viewModel.layout.isDesktopLayout,
				isMobileTabletLandscape: viewModel.layout.isMobileTabletLandscape,
			};
		},
		useGamePageMobileLayoutShellModel: () => {
			const viewModel = useGamePage();

			return {
				handleMobileSheetOpenChange:
					viewModel.mobileSheet.handleMobileSheetOpenChange,
				isMobileSheetOpen: viewModel.mobileSheet.isMobileSheetOpen,
			};
		},
		useGamePageMobileCanvasStageModel: () => {
			const viewModel = useGamePage();

			return {
				cameraStateSnapshot: viewModel.canvas.cameraStateSnapshot,
				canvasMachineRuntime: viewModel.canvas.canvasMachineRuntime,
				postprocessingEnabled: true,
			};
		},
		useGamePageMobileTopBarModel: () => {
			const viewModel = useGamePage();

			return {
				cameraStateSnapshot: viewModel.canvas.cameraStateSnapshot,
				handleCameraModeSwitch: viewModel.canvas.handleCameraModeSwitch,
				handleDungeonRunReset: viewModel.hud.handleDungeonRunReset,
				playerHp: viewModel.hud.playerHp,
				playerMaxHp: viewModel.hud.playerMaxHp,
			};
		},
		useGamePageMobileJoystickModel: () => {
			const viewModel = useGamePage();

			return {
				handleTouchJoystickMove: viewModel.touch.handleTouchJoystickMove,
				handleTouchJoystickStop: viewModel.touch.handleTouchJoystickStop,
			};
		},
		useGamePageInputOrchestrator: () => ({
			sendInput: vi.fn(),
			isDesktopRunHeld: false,
			isJumpActive: false,
			isMobileRunToggled: false,
			touchLook: {
				handlePointerDown: vi.fn(),
				handlePointerMove: vi.fn(),
				handlePointerUp: vi.fn(),
				handlePointerCancel: vi.fn(),
			},
			touchMovement: {
				handleMoveVelocity: vi.fn(),
				handleStopVelocity: vi.fn(),
			},
		}),
		useGamePageMobileCameraControlHandlers: () => ({
			onLookPointerDown: undefined,
			onLookPointerMove: undefined,
			onLookPointerUp: undefined,
			onLookPointerCancel: undefined,
		}),
		useGamePageMachineState: () => ({
			playerActorRef: createMockActorRef(),
			cameraActorRef: createMockActorRef(),
			gameActorRef: createMockActorRef(),
			playerMachine: {} as never,
			cameraMachine: {} as never,
			gameMachine: {} as never,
			layout: {
				isDesktopLayout: false,
				isMobileTabletLandscape: false,
				isTabletLayout: false,
			},
		}),
		useGamePageMobileActionPanelModel: () => {
			const viewModel = useGamePage();

			return {
				audioToggle: {
					handleAudioMuteToggle: viewModel.audio.handleAudioMuteToggle,
					isAudioMuted: viewModel.audio.isAudioMuted,
					isTabletLayout: viewModel.layout.isTabletLayout,
				},
				leaderboardTrigger: {
					isTabletLayout: viewModel.layout.isTabletLayout,
				},
				settingsTrigger: {
					isTabletLayout: viewModel.layout.isTabletLayout,
				},
				sheetTrigger: {
					isMobileSheetOpen: viewModel.mobileSheet.isMobileSheetOpen,
					isTabletLayout: viewModel.layout.isTabletLayout,
				},
				touchActions: {
					attack: {
						handleTouchAttack: viewModel.touch.handleTouchAttack,
						hasTouchAttack: viewModel.touch.hasTouchAttack,
						touchAttackPrompt: viewModel.touch.touchAttackPrompt,
					},
					interact: {
						handleTouchInteract: viewModel.touch.handleTouchInteract,
						hasTouchInteract: viewModel.touch.hasTouchInteract,
						touchInteractPrompt: viewModel.touch.touchInteractPrompt,
					},
				},
			};
		},
		useGamePageMobileSheetContentModel: () => {
			const viewModel = useGamePage();

			return {
				cameraStateSnapshot: viewModel.canvas.cameraStateSnapshot,
				graphSections: viewModel.visualizer.graphSections,
				handleCameraModeSwitch: viewModel.canvas.handleCameraModeSwitch,
				handleMobileSheetTabChange:
					viewModel.mobileSheet.handleMobileSheetTabChange,
				mobileSheetTabId: viewModel.mobileSheet.mobileSheetTabId,
			};
		},
	};
});

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
	TouchJoystickZone: () => <div data-testid="touch-joystick-widget" />,
	CameraControlZone: ({ children }: { children?: React.ReactNode }) => (
		<div data-testid="camera-control-zone-widget">{children}</div>
	),
}));

vi.mock("@/features/input-orchestrator", () => ({
	MobileActionButtonZone: () => <div data-testid="mobile-action-button-zone" />,
	useInputOrchestrator: () => ({
		sendInput: vi.fn(),
		isDesktopRunHeld: false,
		isMobileRunToggled: false,
	}),
	useKeyboardInputOrchestrator: vi.fn(),
	useTouchLookInput: () => ({
		handlePointerDown: vi.fn(),
		handlePointerMove: vi.fn(),
		handlePointerUp: vi.fn(),
		handlePointerCancel: vi.fn(),
	}),
	useTouchMovementInput: () => ({
		handleMoveVelocity: vi.fn(),
		handleStopVelocity: vi.fn(),
	}),
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

vi.mock("@/widgets/settings-panel", () => ({
	SettingsSheet: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="settings-sheet-widget">{children}</div>
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
		render(
			<TooltipProvider>
				<GamePage />
			</TooltipProvider>,
		);

		expect(screen.getByTestId("game-canvas-widget")).not.toBeNull();
		expect(screen.getByTestId("camera-switcher-widget")).not.toBeNull();
		expect(screen.getByTestId("hud-widget-marker")).not.toBeNull();
		expect(screen.getByTestId("xstate-inspector-widget")).not.toBeNull();
		expect(
			screen.getByTestId("xstate-inspector-details-widget"),
		).not.toBeNull();

		expect(
			within(screen.getByRole("banner"))
				.getAllByRole("button")
				.map((button) => button.getAttribute("aria-label")),
		).toEqual([
			GAME_PAGE_CONTROLS.AUDIO.MUTE_ARIA_LABEL,
			GAME_PAGE_CONTROLS.LEADERBOARD.ARIA_LABEL,
			GAME_PAGE_CONTROLS.SETTINGS.ARIA_LABEL,
		]);

		expect(
			screen.getByRole("button", {
				name: GAME_PAGE_CONTROLS.SETTINGS.ARIA_LABEL,
			}),
		).not.toBeNull();
	});

	it("renders touch overlays and bottom-sheet trigger on mobile and tablet landscape", () => {
		vi.mocked(useGamePage).mockReturnValue(
			createGamePageViewModel({
				layout: {
					isDesktopLayout: false,
					isMobileTabletLandscape: true,
					isTabletLayout: true,
				},
				touch: {
					hasTouchAttack: true,
					hasTouchInteract: true,
					touchAttackPrompt: "Attack",
					touchInteractPrompt: "Enter Library",
				},
			}),
		);

		render(
			<TooltipProvider>
				<GamePage />
			</TooltipProvider>,
		);

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
				name: `Open ${GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}`,
			}),
		).not.toBeNull();
		expect(
			screen.getByRole("button", {
				name: GAME_PAGE_CONTROLS.SETTINGS.ARIA_LABEL,
			}),
		).not.toBeNull();
		expect(
			screen.getByText(GAME_PAGE_CONTROLS.SETTINGS.BUTTON_LABEL),
		).not.toBeNull();
	});

	it("renders rotate-device banner in touch portrait mode", () => {
		vi.mocked(useGamePage).mockReturnValue(
			createGamePageViewModel({
				layout: {
					isDesktopLayout: false,
					isMobileTabletLandscape: false,
				},
			}),
		);

		render(
			<TooltipProvider>
				<GamePage />
			</TooltipProvider>,
		);

		expect(screen.getByText("Rotate Device")).not.toBeNull();
		expect(
			screen.queryByRole("button", {
				name: `Open ${GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}`,
			}),
		).toBeNull();
	});
});
