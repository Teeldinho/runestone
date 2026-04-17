import type { RoomId } from "@/entities/dungeon";

import { deriveTreasureKeyStatusLabel } from "../lib/deriveTreasureKeyStatusLabel";
import type { GamePageViewModel } from "./types";
import { useGamePageAudio } from "./useGamePageAudio";
import { useGamePageMachineState } from "./useGamePageMachineState";
import { useGamePageMobileSheet } from "./useGamePageMobileSheet";
import { useGamePageReset } from "./useGamePageReset";
import { useGamePageTouch } from "./useGamePageTouch";
import { useGamePageVisualizer } from "./useGamePageVisualizer";

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
		audio: {
			handleAudioMuteToggle,
			isAudioMuted,
		},
		canvas: {
			cameraStateSnapshot,
			canvasMachineRuntime: {
				currentRoomId: currentRoomId as RoomId,
				enemiesRemaining,
				hasTreasureKey,
			},
			handleCameraModeSwitch,
		},
		hud: {
			actionButtons,
			activeStateLabel,
			currentRoomLabel,
			discoveredRoomLabels,
			enemiesRemaining,
			handleDungeonRunReset,
			hasTreasureKeyLabel: deriveTreasureKeyStatusLabel(hasTreasureKey),
			playerHp: playerSnapshot.context.stats.hp,
			playerMaxHp: playerSnapshot.context.stats.maxHp,
		},
		layout: {
			isDesktopLayout: layout.isDesktopLayout,
			isMobileTabletLandscape: layout.isMobileTabletLandscape,
			isTabletLayout: layout.isTabletLayout,
		},
		mobileSheet: {
			handleMobileSheetOpenChange,
			handleMobileSheetTabChange,
			isMobileSheetOpen,
			mobileSheetTabId,
		},
		touch: {
			handleTouchAttack,
			handleTouchInteract,
			handleTouchJoystickMove,
			handleTouchJoystickStop,
			hasTouchAttack,
			hasTouchInteract,
			touchAttackPrompt,
			touchInteractPrompt,
		},
		visualizer: {
			graphSections,
		},
	};
};
