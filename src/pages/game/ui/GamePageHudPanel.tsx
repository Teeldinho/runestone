import type { GamePageViewModel } from "@/pages/game/model";
import { GameHud } from "@/widgets/hud";

type GamePageHudPanelProps = {
	viewModel: Pick<
		GamePageViewModel,
		| "actionButtons"
		| "activeStateLabel"
		| "currentRoomLabel"
		| "discoveredRoomLabels"
		| "enemiesRemaining"
		| "handleDungeonRunReset"
		| "hasTreasureKeyLabel"
		| "playerHp"
		| "playerMaxHp"
	>;
};

export function GamePageHudPanel({ viewModel }: GamePageHudPanelProps) {
	return (
		<div className="p-3">
			<GameHud
				actions={{
					actionButtons: viewModel.actionButtons,
					handleDungeonRunReset: viewModel.handleDungeonRunReset,
				}}
				playerStats={{
					playerHp: viewModel.playerHp,
					playerMaxHp: viewModel.playerMaxHp,
				}}
				snapshot={{
					activeStateLabel: viewModel.activeStateLabel,
					currentRoomLabel: viewModel.currentRoomLabel,
					discoveredRoomLabels: viewModel.discoveredRoomLabels,
					enemiesRemaining: viewModel.enemiesRemaining,
					hasTreasureKeyLabel: viewModel.hasTreasureKeyLabel,
				}}
			/>
		</div>
	);
}
