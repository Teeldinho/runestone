import {
	useGamePageAudioContext,
	useGamePageLayoutContext,
	useGamePageMobileSheetContext,
	useGamePageTouchContext,
} from "./useGamePageSliceContexts";

export const useGamePageMobileActionPanelModel = () => {
	const audio = useGamePageAudioContext();
	const layout = useGamePageLayoutContext();
	const mobileSheet = useGamePageMobileSheetContext();
	const touch = useGamePageTouchContext();

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
