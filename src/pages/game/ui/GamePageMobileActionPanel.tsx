import {
	GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES,
	GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS,
} from "@/pages/game/config";
import { useGamePageMobileActionPanelModel } from "@/pages/game/model";
import {
	INPUT_POINTER_DATA_ATTRIBUTE_VALUES,
	INPUT_POINTER_DATA_ATTRIBUTES,
	POINTER_ROLES,
} from "@/shared/config";
import { cn } from "@/shared/lib";

import { GamePageMobileAudioAction } from "./GamePageMobileAudioAction";
import { GamePageMobileLeaderboardAction } from "./GamePageMobileLeaderboardAction";
import { GamePageMobileSettingsAction } from "./GamePageMobileSettingsAction";
import { GamePageMobileSheetAction } from "./GamePageMobileSheetAction";
import { GamePageMobileTouchActions } from "./GamePageMobileTouchActions";

export function GamePageMobileActionPanel() {
	const viewModel = useGamePageMobileActionPanelModel();
	const { isTabletLayout } = viewModel.audioToggle;

	return (
		<div
			data-testid={GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.ROOT}
			{...{
				[INPUT_POINTER_DATA_ATTRIBUTES.ROLE]: POINTER_ROLES.DISCRETE_ACTION,
				[INPUT_POINTER_DATA_ATTRIBUTES.BLOCKS_LOOK]:
					INPUT_POINTER_DATA_ATTRIBUTE_VALUES.TRUE,
			}}
			className={cn(
				GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.ROOT,
				isTabletLayout
					? GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.TABLET_WIDTH
					: GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.COMPACT_WIDTH,
			)}
		>
			<div
				data-testid={GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.PROMPT_SLOT}
				className={GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.PROMPT_SLOT}
			>
				<GamePageMobileTouchActions touchActions={viewModel.touchActions} />
			</div>

			<div
				data-testid={GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS.CONTROL_STACK}
				className={cn(
					GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.CONTROL_STACK,
					isTabletLayout
						? GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.TABLET_CONTROL_STACK
						: GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES.COMPACT_CONTROL_STACK,
				)}
			>
				<GamePageMobileAudioAction audioToggle={viewModel.audioToggle} />
				<GamePageMobileLeaderboardAction
					leaderboardTrigger={viewModel.leaderboardTrigger}
				/>
				<GamePageMobileSheetAction sheetTrigger={viewModel.sheetTrigger} />
				<GamePageMobileSettingsAction
					settingsTrigger={viewModel.settingsTrigger}
				/>
			</div>
		</div>
	);
}
