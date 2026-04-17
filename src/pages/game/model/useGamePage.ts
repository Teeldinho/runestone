import type { RoomId } from "@/entities/dungeon";

import { createGamePageViewModel } from "../lib/createGamePageViewModel";
import { deriveTreasureKeyStatusLabel } from "../lib/deriveTreasureKeyStatusLabel";
import { useGamePageAudio } from "./useGamePageAudio";
import { useGamePageMachineState } from "./useGamePageMachineState";
import { useGamePageMobileSheet } from "./useGamePageMobileSheet";
import { useGamePageReset } from "./useGamePageReset";
import { useGamePageTouch } from "./useGamePageTouch";
import { useGamePageVisualizer } from "./useGamePageVisualizer";
import type { GamePageViewModel } from "./types";

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

	return createGamePageViewModel({
		actionButtons,
		activeStateLabel,
		cameraStateSnapshot,
		currentRoomId: currentRoomId as RoomId,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		graphSections,
		handleAudioMuteToggle,
		handleCameraModeSwitch,
		handleDungeonRunReset,
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		handleTouchAttack,
		handleTouchInteract,
		hasTouchAttack,
		hasTouchInteract,
		hasTreasureKey,
		hasTreasureKeyLabel: deriveTreasureKeyStatusLabel(hasTreasureKey),
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
	});
};
