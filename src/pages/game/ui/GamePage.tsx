import { useCallback, useState } from "react";

import { useSettingsForm } from "@/features/settings";
import { useGamePage } from "@/pages/game/model";

import { GamePageDesktopLayout } from "./GamePageDesktopLayout";
import { GamePageHudPanel } from "./GamePageHudPanel";
import { GamePageMobileLayout } from "./GamePageMobileLayout";
import { GamePagePortraitGate } from "./GamePagePortraitGate";

export function GamePage() {
	const gamePageViewModel = useGamePage();
	const settings = useSettingsForm();

	const [firstPersonLookElement, setFirstPersonLookElement] =
		useState<HTMLElement | null>(null);
	const firstPersonLookRef = useCallback((node: HTMLElement | null) => {
		setFirstPersonLookElement(node);
	}, []);

	const [cameraControlElement, setCameraControlElement] =
		useState<HTMLElement | null>(null);
	const cameraControlRef = useCallback((node: HTMLElement | null) => {
		setCameraControlElement(node);
	}, []);

	const gameHudContent = <GamePageHudPanel viewModel={gamePageViewModel} />;

	if (
		!gamePageViewModel.isDesktopLayout &&
		!gamePageViewModel.isMobileTabletLandscape
	) {
		return <GamePagePortraitGate />;
	}

	if (gamePageViewModel.isMobileTabletLandscape) {
		return (
			<GamePageMobileLayout
				cameraElements={{
					cameraControlElement,
					cameraControlRef,
					firstPersonLookElement,
					firstPersonLookRef,
				}}
				gameHudContent={gameHudContent}
				postprocessingEnabled={settings.postprocessingEnabled}
				viewModel={{
					cameraStateSnapshot: gamePageViewModel.cameraStateSnapshot,
					canvasMachineRuntime: gamePageViewModel.canvasMachineRuntime,
					graphSections: gamePageViewModel.graphSections,
					handleAudioMuteToggle: gamePageViewModel.handleAudioMuteToggle,
					handleCameraModeSwitch: gamePageViewModel.handleCameraModeSwitch,
					handleDungeonRunReset: gamePageViewModel.handleDungeonRunReset,
					handleMobileSheetOpenChange:
						gamePageViewModel.handleMobileSheetOpenChange,
					handleMobileSheetTabChange:
						gamePageViewModel.handleMobileSheetTabChange,
					handleTouchAttack: gamePageViewModel.handleTouchAttack,
					handleTouchInteract: gamePageViewModel.handleTouchInteract,
					handleTouchJoystickMove: gamePageViewModel.handleTouchJoystickMove,
					handleTouchJoystickStop: gamePageViewModel.handleTouchJoystickStop,
					hasTouchAttack: gamePageViewModel.hasTouchAttack,
					hasTouchInteract: gamePageViewModel.hasTouchInteract,
					isAudioMuted: gamePageViewModel.isAudioMuted,
					isMobileSheetOpen: gamePageViewModel.isMobileSheetOpen,
					isTabletLayout: gamePageViewModel.isTabletLayout,
					mobileSheetTabId: gamePageViewModel.mobileSheetTabId,
					playerHp: gamePageViewModel.playerHp,
					playerMaxHp: gamePageViewModel.playerMaxHp,
					touchAttackPrompt: gamePageViewModel.touchAttackPrompt,
					touchInteractPrompt: gamePageViewModel.touchInteractPrompt,
				}}
			/>
		);
	}

	return (
		<GamePageDesktopLayout
			gameHudContent={gameHudContent}
			postprocessingEnabled={settings.postprocessingEnabled}
			viewModel={{
				cameraStateSnapshot: gamePageViewModel.cameraStateSnapshot,
				canvasMachineRuntime: gamePageViewModel.canvasMachineRuntime,
				currentRoomLabel: gamePageViewModel.currentRoomLabel,
				graphSections: gamePageViewModel.graphSections,
				handleAudioMuteToggle: gamePageViewModel.handleAudioMuteToggle,
				handleCameraModeSwitch: gamePageViewModel.handleCameraModeSwitch,
				isAudioMuted: gamePageViewModel.isAudioMuted,
				isMobileTabletLandscape: gamePageViewModel.isMobileTabletLandscape,
			}}
		/>
	);
}
