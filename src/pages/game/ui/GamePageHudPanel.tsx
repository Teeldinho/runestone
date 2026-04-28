import { useGamePageHudPanelModel } from "@/pages/game/model";
import { GameHud } from "@/widgets/hud";

export function GamePageHudPanel() {
	const viewModel = useGamePageHudPanelModel();

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
					currentRoomLabel: viewModel.currentRoomLabel,
					discoveredRoomLabels: viewModel.discoveredRoomLabels,
					enemiesRemaining: viewModel.enemiesRemaining,
					hasTreasureKeyLabel: viewModel.hasTreasureKeyLabel,
					nearInteractableLabel: viewModel.nearInteractableLabel,
				}}
			/>
		</div>
	);
}
