import { createGamePageMobileLayoutShellViewModel } from "../lib/createGamePageMobileLayoutShellViewModel";
import {
	useGamePageLayoutContext,
	useGamePageMobileSheetContext,
} from "./useGamePageSliceContexts";

export const useGamePageMobileLayoutShellModel = () => {
	const layout = useGamePageLayoutContext();
	const mobileSheet = useGamePageMobileSheetContext();

	return createGamePageMobileLayoutShellViewModel({
		handleMobileSheetOpenChange: mobileSheet.handleMobileSheetOpenChange,
		isMobileSheetOpen: mobileSheet.isMobileSheetOpen,
		isPortraitLayout: layout.isPortraitLayout,
	});
};
