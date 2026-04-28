import { useGamePageLayoutMode } from "@/pages/game/model";

import { GamePageDesktopLayout } from "./GamePageDesktopLayout";
import { GamePageMobileLayout } from "./GamePageMobileLayout";
import { GamePagePortraitGate } from "./GamePagePortraitGate";

export function GamePageLayoutRouter() {
	const { isDesktopLayout, isMobileTabletLandscape } = useGamePageLayoutMode();

	if (!isDesktopLayout && !isMobileTabletLandscape) {
		return <GamePagePortraitGate />;
	}

	if (isMobileTabletLandscape) {
		return <GamePageMobileLayout />;
	}

	return <GamePageDesktopLayout />;
}
