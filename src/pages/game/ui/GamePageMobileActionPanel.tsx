import { useGamePageMobileActionPanelModel } from "@/pages/game/model";
import {
	INPUT_POINTER_DATA_ATTRIBUTE_VALUES,
	INPUT_POINTER_DATA_ATTRIBUTES,
	POINTER_ROLES,
} from "@/shared/config";

import { GamePageMobileAudioAction } from "./GamePageMobileAudioAction";
import { GamePageMobileLeaderboardAction } from "./GamePageMobileLeaderboardAction";
import { GamePageMobileSettingsAction } from "./GamePageMobileSettingsAction";
import { GamePageMobileSheetAction } from "./GamePageMobileSheetAction";
import { GamePageMobileTouchActions } from "./GamePageMobileTouchActions";

export function GamePageMobileActionPanel() {
	const viewModel = useGamePageMobileActionPanelModel();

	return (
		<div
			{...{
				[INPUT_POINTER_DATA_ATTRIBUTES.ROLE]: POINTER_ROLES.DISCRETE_ACTION,
				[INPUT_POINTER_DATA_ATTRIBUTES.BLOCKS_LOOK]:
					INPUT_POINTER_DATA_ATTRIBUTE_VALUES.TRUE,
			}}
			className="pointer-events-auto flex w-fit flex-col items-end gap-2 empty:hidden"
		>
			<GamePageMobileTouchActions touchActions={viewModel.touchActions} />
			<GamePageMobileAudioAction audioToggle={viewModel.audioToggle} />
			<GamePageMobileLeaderboardAction
				leaderboardTrigger={viewModel.leaderboardTrigger}
			/>
			<GamePageMobileSheetAction sheetTrigger={viewModel.sheetTrigger} />
			<GamePageMobileSettingsAction
				settingsTrigger={viewModel.settingsTrigger}
			/>
		</div>
	);
}
