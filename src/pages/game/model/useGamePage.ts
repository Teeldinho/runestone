import { useCallback, useEffect, useMemo } from "react";

import { createFloorOneMachine } from "@/entities/dungeon";
import {
	createPlayerMachine,
	PLAYER_EVENTS,
	usePlayerMachineRuntime,
} from "@/entities/player";
import { audioMachine, useAudioController } from "@/features/audio-manager";
import {
	createCameraMachine,
	type useCameraMachine,
} from "@/features/camera-system";
import type { useGameMachine } from "@/features/dungeon-navigation";
import {
	STATE_VISUALIZER_SECTION_IDS,
	useStateVisualizer,
} from "@/features/state-visualizer";
import type { Vector3Tuple } from "@/shared/lib";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";
import type { GAME_PAGE_MOBILE_SHEET } from "../config";
import { useGamePageAudio } from "./useGamePageAudio";
import { useGamePageCamera } from "./useGamePageCamera";
import { useGamePageLayout } from "./useGamePageLayout";
import { useGamePageReset } from "./useGamePageReset";
import { useGamePageSheet } from "./useGamePageSheet";
import { useGamePageState } from "./useGamePageState";
import { useGamePageTouch } from "./useGamePageTouch";

type GamePageViewModel = {
	actionButtons: ReturnType<typeof useGameMachine>["actionButtons"];
	activeStateLabel: string;
	cameraStateSnapshot: ReturnType<
		typeof useCameraMachine
	>["cameraStateSnapshot"];
	canvasMachineRuntime: CanvasMachineRuntime;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	graphSections: ReturnType<typeof useStateVisualizer>["sections"];
	handleAudioMuteToggle: () => void;
	handleCameraModeSwitch: ReturnType<
		typeof useCameraMachine
	>["handleCameraModeSwitch"];
	hasTreasureKeyLabel: string;
	handleDungeonRunReset: () => void;
	handleMobileSheetOpenChange: (isOpen: boolean) => void;
	handleMobileSheetTabChange: (tabId: string) => void;
	handleTouchJoystickMove: (velocity: Vector3Tuple) => void;
	handleTouchJoystickStop: () => void;
	handleTouchAttack: () => void;
	handleTouchInteract: () => void;
	hasTouchAttack: boolean;
	hasTouchInteract: boolean;
	isAudioMuted: boolean;
	isDesktopLayout: boolean;
	isMobileSheetOpen: boolean;
	isMobileTabletLandscape: boolean;
	isTabletLayout: boolean;
	mobileSheetTabId: GamePageMobileSheetTabId;
	playerHp: number;
	playerMaxHp: number;
	touchAttackPrompt: string | null;
	touchInteractPrompt: string | null;
};

type GamePageMobileSheetTabId =
	(typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS)[keyof typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS];

export const useGamePage = (): GamePageViewModel => {
	const audio = useGamePageAudio();
	const layout = useGamePageLayout();
	const sheet = useGamePageSheet();
	const touch = useGamePageTouch();
	const state = useGamePageState();
	const camera = useGamePageCamera();
	const reset = useGamePageReset();

	const { audioState } = useAudioController();
	const { snapshot: playerSnapshot, sendPlayerMachineEvent } =
		usePlayerMachineRuntime();

	const isMobileTabletLandscape = layout.isMobileTabletLandscape;

	useEffect(() => {
		if (!isMobileTabletLandscape) {
			return;
		}

		const previousBodyOverflow = document.body.style.overflow;
		const previousBodyOverscrollBehavior =
			document.body.style.overscrollBehavior;
		const previousHtmlOverflow = document.documentElement.style.overflow;
		const previousHtmlOverscrollBehavior =
			document.documentElement.style.overscrollBehavior;

		document.body.style.overflow = "hidden";
		document.body.style.overscrollBehavior = "none";
		document.documentElement.style.overflow = "hidden";
		document.documentElement.style.overscrollBehavior = "none";

		return () => {
			document.body.style.overflow = previousBodyOverflow;
			document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
			document.documentElement.style.overflow = previousHtmlOverflow;
			document.documentElement.style.overscrollBehavior =
				previousHtmlOverscrollBehavior;
		};
	}, [isMobileTabletLandscape]);

	const visualizerMachinesBySectionId = useMemo(
		() => ({
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]: createFloorOneMachine(),
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]: createCameraMachine(),
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: audioMachine,
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: createPlayerMachine(),
		}),
		[],
	);

	const { sections: graphSections } = useStateVisualizer({
		machinesBySectionId: visualizerMachinesBySectionId,
		stateValuesBySectionId: {
			[STATE_VISUALIZER_SECTION_IDS.DUNGEON]:
				state.canvasMachineRuntime.currentRoomId,
			[STATE_VISUALIZER_SECTION_IDS.CAMERA]: camera.cameraMode,
			[STATE_VISUALIZER_SECTION_IDS.AUDIO]: audioState,
			[STATE_VISUALIZER_SECTION_IDS.PLAYER]: playerSnapshot.value,
		},
	});

	const handleTouchJoystickMove = useCallback(
		(velocity: Vector3Tuple) => {
			sendPlayerMachineEvent({
				type: PLAYER_EVENTS.MOVE,
				velocity,
				isSprinting: false,
			});
		},
		[sendPlayerMachineEvent],
	);

	const handleTouchJoystickStop = useCallback(() => {
		sendPlayerMachineEvent({ type: PLAYER_EVENTS.STOP });
	}, [sendPlayerMachineEvent]);

	return {
		actionButtons: state.actionButtons,
		activeStateLabel: state.activeStateLabel,
		cameraStateSnapshot: camera.cameraStateSnapshot,
		canvasMachineRuntime: state.canvasMachineRuntime,
		currentRoomLabel: state.currentRoomLabel,
		discoveredRoomLabels: state.discoveredRoomLabels,
		enemiesRemaining: state.enemiesRemaining,
		graphSections,
		handleAudioMuteToggle: audio.handleAudioMuteToggle,
		handleCameraModeSwitch: camera.handleCameraModeSwitch,
		hasTreasureKeyLabel: state.hasTreasureKeyLabel,
		handleDungeonRunReset: reset.handleDungeonRunReset,
		handleMobileSheetOpenChange: sheet.handleMobileSheetOpenChange,
		handleMobileSheetTabChange: sheet.handleMobileSheetTabChange,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		handleTouchAttack: touch.handleTouchAttack,
		handleTouchInteract: touch.handleTouchInteract,
		hasTouchAttack: touch.hasTouchAttack,
		hasTouchInteract: touch.hasTouchInteract,
		isAudioMuted: audio.isAudioMuted,
		isDesktopLayout: layout.isDesktopLayout,
		isMobileSheetOpen: sheet.isMobileSheetOpen,
		isMobileTabletLandscape: layout.isMobileTabletLandscape,
		isTabletLayout: layout.isTabletLayout,
		mobileSheetTabId: sheet.mobileSheetTabId,
		playerHp: state.playerHp,
		playerMaxHp: state.playerMaxHp,
		touchAttackPrompt: touch.touchAttackPrompt,
		touchInteractPrompt: touch.touchInteractPrompt,
	};
};

export type { GamePageViewModel };
