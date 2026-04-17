import type { RoomId } from "@/entities/dungeon";
import type {
	CameraMachineEvent,
	CameraStateSnapshot,
} from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import type { CanvasMachineRuntime } from "@/widgets/game-canvas";

import { deriveTreasureKeyStatusLabel } from "../lib/deriveTreasureKeyStatusLabel";
import { useGamePageAudio } from "./useGamePageAudio";
import { useGamePageMachineState } from "./useGamePageMachineState";
import {
	type GamePageMobileSheetTabId,
	useGamePageMobileSheet,
} from "./useGamePageMobileSheet";
import { useGamePageReset } from "./useGamePageReset";
import { useGamePageTouch } from "./useGamePageTouch";
import { useGamePageVisualizer } from "./useGamePageVisualizer";

type GamePageViewModel = {
	actionButtons: ReturnType<
		typeof useGamePageMachineState
	>["gameMachine"]["actionButtons"];
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
	const { cameraMachine, gameMachine, layout, playerMachine } =
		useGamePageMachineState();
	const {
		activeStateLabel,
		actionButtons,
		currentRoomId,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonEventSend,
		handleDungeonRunReset: resetDungeonMachine,
		hasTreasureKey,
	} = gameMachine;
	const {
		cameraStateSnapshot,
		handleCameraModeSwitch,
		mode: cameraMode,
	} = cameraMachine;
	const { sendPlayerMachineEvent, snapshot: playerSnapshot } = playerMachine;
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
		handleDungeonEventSend,
		sendPlayerMachineEvent,
	});
	const {
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		isMobileSheetOpen,
		mobileSheetTabId,
	} = useGamePageMobileSheet({
		isMobileTabletLandscape: layout.isMobileTabletLandscape,
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
		hasTreasureKeyLabel: deriveTreasureKeyStatusLabel(hasTreasureKey),
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
		isDesktopLayout: layout.isDesktopLayout,
		isMobileSheetOpen,
		isMobileTabletLandscape: layout.isMobileTabletLandscape,
		isTabletLayout: layout.isTabletLayout,
		mobileSheetTabId,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
		touchAttackPrompt,
		touchInteractPrompt,
	};
};

export type { GamePageViewModel };
