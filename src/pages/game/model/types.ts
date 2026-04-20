import type {
	CameraMachineEvent,
	CameraStateSnapshot,
} from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";

import type { useGamePageMachineState } from "./useGamePageMachineState";
import type { GamePageMobileSheetTabId } from "./useGamePageMobileSheet";
import type { useGamePageVisualizer } from "./useGamePageVisualizer";

type GamePageHudSlice = {
	actionButtons: ReturnType<
		typeof useGamePageMachineState
	>["gameMachine"]["actionButtons"];
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	handleDungeonRunReset: () => void;
	hasTreasureKeyLabel: string;
	nearInteractableLabel: string;
	playerHp: number;
	playerMaxHp: number;
};

type GamePageCanvasSlice = {
	cameraStateSnapshot: CameraStateSnapshot;
	canvasMachineRuntime: CanvasMachineRuntime;
	handleCameraModeSwitch: (event: CameraMachineEvent) => void;
};

type GamePageAudioSlice = {
	handleAudioMuteToggle: () => void;
	isAudioMuted: boolean;
};

type GamePageLayoutSlice = {
	isDesktopLayout: boolean;
	isMobileTabletLandscape: boolean;
	isTabletLayout: boolean;
};

type GamePageMobileSheetSlice = {
	handleMobileSheetOpenChange: (isOpen: boolean) => void;
	handleMobileSheetTabChange: (tabId: string) => void;
	isMobileSheetOpen: boolean;
	mobileSheetTabId: GamePageMobileSheetTabId;
};

type GamePageTouchSlice = {
	handleTouchJoystickMove: (velocity: Vector3Tuple) => void;
	handleTouchJoystickStop: () => void;
	handleTouchAttack: () => void;
	handleTouchInteract: () => void;
	hasTouchAttack: boolean;
	hasTouchInteract: boolean;
	touchAttackPrompt: string | null;
	touchInteractPrompt: string | null;
};

type GamePageVisualizerSlice = {
	graphSections: ReturnType<typeof useGamePageVisualizer>["graphSections"];
};

type GamePageViewModel = {
	audio: GamePageAudioSlice;
	canvas: GamePageCanvasSlice;
	hud: GamePageHudSlice;
	layout: GamePageLayoutSlice;
	mobileSheet: GamePageMobileSheetSlice;
	touch: GamePageTouchSlice;
	visualizer: GamePageVisualizerSlice;
};

export type {
	GamePageAudioSlice,
	GamePageCanvasSlice,
	GamePageHudSlice,
	GamePageLayoutSlice,
	GamePageMobileSheetSlice,
	GamePageTouchSlice,
	GamePageViewModel,
	GamePageVisualizerSlice,
};
