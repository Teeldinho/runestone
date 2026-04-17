import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileActionPanelModel = () => {
	const {
		handleAudioMuteToggle,
		handleTouchAttack,
		handleTouchInteract,
		hasTouchAttack,
		hasTouchInteract,
		isAudioMuted,
		isMobileSheetOpen,
		isTabletLayout,
		touchAttackPrompt,
		touchInteractPrompt,
	} = useGamePageViewModelContext();

	return {
		handleAudioMuteToggle,
		handleTouchAttack,
		handleTouchInteract,
		hasTouchAttack,
		hasTouchInteract,
		isAudioMuted,
		isMobileSheetOpen,
		isTabletLayout,
		touchAttackPrompt,
		touchInteractPrompt,
	};
};
