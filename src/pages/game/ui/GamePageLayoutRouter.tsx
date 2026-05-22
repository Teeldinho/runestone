import { useGamePageLayoutMode } from "@/pages/game/model";

import { GamePageDesktopLayout } from "./GamePageDesktopLayout";
import { GamePageMobileLayout } from "./GamePageMobileLayout";

export function GamePageLayoutRouter() {
	const { isDesktopLayout } = useGamePageLayoutMode();

	if (isDesktopLayout) {
		return <GamePageDesktopLayout />;
	}

	return <GamePageMobileLayout />;
}
