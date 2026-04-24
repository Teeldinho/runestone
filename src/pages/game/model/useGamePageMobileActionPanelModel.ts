import {
	useGamePageAudioContext,
	useGamePageLayoutContext,
	useGamePageMobileSheetContext,
	useGamePageTouchContext,
} from "./useGamePageSliceContexts";

type GamePageMobileActionPanelTouchAttack = {
	handleTouchAttack: () => void;
	hasTouchAttack: boolean;
	touchAttackPrompt: string | null;
};

type GamePageMobileActionPanelTouchInteract = {
	handleTouchInteract: () => void;
	hasTouchInteract: boolean;
	touchInteractPrompt: string | null;
};

type GamePageMobileActionPanelModel = {
	audioToggle: {
		handleAudioMuteToggle: () => void;
		isAudioMuted: boolean;
		isTabletLayout: boolean;
	};
	leaderboardTrigger: {
		isTabletLayout: boolean;
	};
	settingsTrigger: {
		isTabletLayout: boolean;
	};
	sheetTrigger: {
		isMobileSheetOpen: boolean;
		isTabletLayout: boolean;
	};
	touchActions: {
		attack: GamePageMobileActionPanelTouchAttack;
		interact: GamePageMobileActionPanelTouchInteract;
	};
};

export const useGamePageMobileActionPanelModel =
	(): GamePageMobileActionPanelModel => {
		const audio = useGamePageAudioContext();
		const layout = useGamePageLayoutContext();
		const mobileSheet = useGamePageMobileSheetContext();
		const touch = useGamePageTouchContext();

		return {
			audioToggle: {
				handleAudioMuteToggle: audio.handleAudioMuteToggle,
				isAudioMuted: audio.isAudioMuted,
				isTabletLayout: layout.isTabletLayout,
			},
			leaderboardTrigger: {
				isTabletLayout: layout.isTabletLayout,
			},
			settingsTrigger: {
				isTabletLayout: layout.isTabletLayout,
			},
			sheetTrigger: {
				isMobileSheetOpen: mobileSheet.isMobileSheetOpen,
				isTabletLayout: layout.isTabletLayout,
			},
			touchActions: {
				attack: {
					handleTouchAttack: touch.handleTouchAttack,
					hasTouchAttack: touch.hasTouchAttack,
					touchAttackPrompt: touch.touchAttackPrompt,
				},
				interact: {
					handleTouchInteract: touch.handleTouchInteract,
					hasTouchInteract: touch.hasTouchInteract,
					touchInteractPrompt: touch.touchInteractPrompt,
				},
			},
		};
	};

export type {
	GamePageMobileActionPanelModel,
	GamePageMobileActionPanelTouchAttack,
	GamePageMobileActionPanelTouchInteract,
};
