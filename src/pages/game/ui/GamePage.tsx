import { GamePageViewModelProvider } from "@/pages/game/model";

import { GamePageLayoutRouter } from "./GamePageLayoutRouter";

export function GamePage() {
	return (
		<GamePageViewModelProvider>
			<GamePageLayoutRouter />
		</GamePageViewModelProvider>
	);
}
