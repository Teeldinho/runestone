import { useSettingsForm } from "@/features/settings";

import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileLayoutModel = () => {
	const {
		cameraStateSnapshot,
		canvasMachineRuntime,
		graphSections,
		handleAudioMuteToggle,
		handleCameraModeSwitch,
		handleDungeonRunReset,
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		handleTouchAttack,
		handleTouchInteract,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		hasTouchAttack,
		hasTouchInteract,
		isAudioMuted,
		isMobileSheetOpen,
		isTabletLayout,
		mobileSheetTabId,
		playerHp,
		playerMaxHp,
		touchAttackPrompt,
		touchInteractPrompt,
	} = useGamePageViewModelContext();
	const { postprocessingEnabled } = useSettingsForm();

	return {
		cameraStateSnapshot,
		canvasMachineRuntime,
		graphSections,
		handleAudioMuteToggle,
		handleCameraModeSwitch,
		handleDungeonRunReset,
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		handleTouchAttack,
		handleTouchInteract,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		hasTouchAttack,
		hasTouchInteract,
		isAudioMuted,
		isMobileSheetOpen,
		isTabletLayout,
		mobileSheetTabId,
		playerHp,
		playerMaxHp,
		postprocessingEnabled,
		touchAttackPrompt,
		touchInteractPrompt,
	};
};
