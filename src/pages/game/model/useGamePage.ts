import type { RoomId } from "@/entities/dungeon";
import { usePlayerMachineRuntime } from "@/entities/player";
import {
	type CameraMachineEvent,
	type CameraStateSnapshot,
	useCameraMachine,
} from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
import type { Vector3Tuple } from "@/shared/lib";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";

import { GAME_PAGE_COPY } from "../config";
import { useGamePageAudio } from "./useGamePageAudio";
import {
	type GamePageMobileSheetTabId,
	useGamePageMobileSheet,
} from "./useGamePageMobileSheet";
import { useGamePageReset } from "./useGamePageReset";
import { useGamePageTouch } from "./useGamePageTouch";
import { useGamePageVisualizer } from "./useGamePageVisualizer";

type GamePageViewModel = {
	actionButtons: ReturnType<typeof useGameMachine>["actionButtons"];
	activeStateLabel: string;
	cameraStateSnapshot: CameraStateSnapshot;
	canvasMachineRuntime: CanvasMachineRuntime;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	graphSections: ReturnType<typeof useGamePageVisualizer>["graphSections"];
	handleAudioMuteToggle: () => void;
	handleCameraModeSwitch: (event: CameraMachineEvent) => void;
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

export const useGamePage = (): GamePageViewModel => {
	const {
		activeStateLabel,
		actionButtons,
		currentRoomLabel,
		currentRoomId,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonEventSend: sendDungeonEvent,
		handleDungeonRunReset: resetDungeonMachine,
		hasTreasureKey,
	} = useGameMachine();
	const { snapshot: playerSnapshot, sendPlayerMachineEvent } =
		usePlayerMachineRuntime();
	const {
		cameraStateSnapshot,
		handleCameraModeSwitch,
		mode: cameraMode,
	} = useCameraMachine();
	const { isDesktopLayout, isLandscape, isTabletLayout } =
		useResponsiveGameLayout();
	const { audioState, handleAudioMuteToggle, isAudioMuted } =
		useGamePageAudio();
	const {
		handleTouchAttack,
		handleTouchInteract,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		hasTouchAttack,
		hasTouchInteract,
		touchAttackPrompt,
		touchInteractPrompt,
	} = useGamePageTouch({
		handleDungeonEventSend: sendDungeonEvent,
		sendPlayerMachineEvent,
	});
	const isMobileTabletLandscape = !isDesktopLayout && isLandscape;
	const {
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		isMobileSheetOpen,
		mobileSheetTabId,
	} = useGamePageMobileSheet({
		isMobileTabletLandscape,
	});
	const { handleDungeonRunReset } = useGamePageReset({
		resetDungeonMachine,
		sendPlayerMachineEvent,
	});
	const { graphSections } = useGamePageVisualizer({
		audioState,
		cameraMode,
		currentRoomId: currentRoomId as RoomId,
		playerStateValue: playerSnapshot.value,
	});

	return {
		actionButtons,
		activeStateLabel,
		cameraStateSnapshot,
		canvasMachineRuntime: {
			currentRoomId,
			enemiesRemaining,
			hasTreasureKey,
		},
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		graphSections,
		handleAudioMuteToggle,
		handleCameraModeSwitch,
		hasTreasureKeyLabel: hasTreasureKey
			? GAME_PAGE_COPY.TREASURE_KEY_STATUS.ACQUIRED
			: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		handleDungeonRunReset,
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		handleTouchAttack,
		handleTouchInteract,
		hasTouchAttack,
		hasTouchInteract,
		isAudioMuted,
		isDesktopLayout,
		isMobileSheetOpen,
		isMobileTabletLandscape,
		isTabletLayout,
		mobileSheetTabId,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
		touchAttackPrompt,
		touchInteractPrompt,
	};
};

export type { GamePageViewModel };
