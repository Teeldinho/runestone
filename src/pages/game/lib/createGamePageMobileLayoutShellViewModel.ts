type CreateGamePageMobileLayoutShellViewModelInput = {
	handleMobileSheetOpenChange: (isOpen: boolean) => void;
	isMobileSheetOpen: boolean;
	isPortraitLayout: boolean;
};

type GamePageMobileLayoutShellViewModel = {
	drawerOpen: boolean;
	handleDrawerOpenChange: (isOpen: boolean) => void;
	isInputBlocked: boolean;
	isPortraitGateVisible: boolean;
	shouldRenderSheetContent: boolean;
};

export const createGamePageMobileLayoutShellViewModel = ({
	handleMobileSheetOpenChange,
	isMobileSheetOpen,
	isPortraitLayout,
}: CreateGamePageMobileLayoutShellViewModelInput): GamePageMobileLayoutShellViewModel => {
	const handleDrawerOpenChange = (isOpen: boolean) => {
		if (isPortraitLayout) {
			return;
		}

		handleMobileSheetOpenChange(isOpen);
	};

	return {
		drawerOpen: isPortraitLayout ? false : isMobileSheetOpen,
		handleDrawerOpenChange,
		isInputBlocked: isPortraitLayout,
		isPortraitGateVisible: isPortraitLayout,
		shouldRenderSheetContent: !isPortraitLayout,
	};
};

export type {
	CreateGamePageMobileLayoutShellViewModelInput,
	GamePageMobileLayoutShellViewModel,
};
