import { useGamePageMobileActionPanelModel } from "@/pages/game/model";

import { GamePageMobileAudioAction } from "./GamePageMobileAudioAction";
import { GamePageMobileLeaderboardAction } from "./GamePageMobileLeaderboardAction";
import { GamePageMobileSheetAction } from "./GamePageMobileSheetAction";
import { GamePageMobileTouchActions } from "./GamePageMobileTouchActions";

export function GamePageMobileActionPanel() {
	const viewModel = useGamePageMobileActionPanelModel();

	return (
		<div className="pointer-events-none absolute right-4 bottom-4 z-30 flex w-[11rem] flex-col items-end gap-2 empty:hidden">
			<GamePageMobileTouchActions touchActions={viewModel.touchActions} />
			<GamePageMobileAudioAction audioToggle={viewModel.audioToggle} />
			<GamePageMobileLeaderboardAction
				leaderboardTrigger={viewModel.leaderboardTrigger}
			/>
			<GamePageMobileSheetAction sheetTrigger={viewModel.sheetTrigger} />
		</div>
	);
}
