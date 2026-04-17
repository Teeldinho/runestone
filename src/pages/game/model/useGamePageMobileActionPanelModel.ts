import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileActionPanelModel = () => {
	const { audio, layout, mobileSheet, touch } = useGamePageViewModelContext();

	return {
		handleAudioMuteToggle: audio.handleAudioMuteToggle,
		handleTouchAttack: touch.handleTouchAttack,
		handleTouchInteract: touch.handleTouchInteract,
		hasTouchAttack: touch.hasTouchAttack,
		hasTouchInteract: touch.hasTouchInteract,
		isAudioMuted: audio.isAudioMuted,
		isMobileSheetOpen: mobileSheet.isMobileSheetOpen,
		isTabletLayout: layout.isTabletLayout,
		touchAttackPrompt: touch.touchAttackPrompt,
		touchInteractPrompt: touch.touchInteractPrompt,
	};
};
